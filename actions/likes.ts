"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { getSkills, withDatabaseTimeout } from "@/lib/db/data-fetchers";
import {
  LIKE_ENTITY_TYPES,
  LikeEntityType,
  LikeState,
  LikeToggleResult,
} from "@/types/like";

const ENTITY_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const MAX_BATCH_IDS = 100;

const RATE_LIMIT_PER_VISITOR = { limit: 30, windowMs: 60_000 };
const RATE_LIMIT_PER_IP = { limit: 120, windowMs: 60_000 };

function isLikeEntityType(value: unknown): value is LikeEntityType {
  return (
    typeof value === "string" && LIKE_ENTITY_TYPES.includes(value as LikeEntityType)
  );
}

function isEntityId(value: unknown): value is string {
  return typeof value === "string" && ENTITY_ID_PATTERN.test(value);
}

function likesAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL && prisma?.like);
}

async function isRateLimitedForVisitor(visitorId: string): Promise<boolean> {
  try {
    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";

    return (
      isRateLimited(
        `like:visitor:${visitorId}`,
        RATE_LIMIT_PER_VISITOR.limit,
        RATE_LIMIT_PER_VISITOR.windowMs
      ) ||
      isRateLimited(
        `like:ip:${ip}`,
        RATE_LIMIT_PER_IP.limit,
        RATE_LIMIT_PER_IP.windowMs
      )
    );
  } catch {
    return false;
  }
}

/**
 * Visibility rules — a like may only target publicly accessible content.
 */
async function isEntityEligible(
  entityType: LikeEntityType,
  entityId: string
): Promise<boolean> {
  switch (entityType) {
    case "PROJECT": {
      const project = await prisma.project.findFirst({
        where: { id: entityId, published: true },
        select: { id: true },
      });
      return Boolean(project);
    }
    case "ARTICLE": {
      const article = await prisma.article.findFirst({
        where: { id: entityId, status: "PUBLISHED" },
        select: { id: true },
      });
      return Boolean(article);
    }
    case "REVIEW": {
      const review = await prisma.review.findFirst({
        where: { id: entityId, status: "APPROVED" },
        select: { id: true },
      });
      return Boolean(review);
    }
    case "SKILL": {
      // Skills may live in the database or in the static/local fallback list.
      const skills = await getSkills();
      return skills.some((skill) => skill.id === entityId);
    }
    default:
      return false;
  }
}

/**
 * Returns like state (count + whether the current visitor liked it) for a
 * batch of entities. Used by the client to hydrate like buttons after a page
 * load, so server-rendered counts (which may come from a cached prerender)
 * always end up in sync with the database.
 *
 * Two grouped queries per batch — never one query per item.
 */
export async function getLikeStatesAction(
  entityType: LikeEntityType,
  ids: string[]
): Promise<Record<string, LikeState>> {
  if (!isLikeEntityType(entityType) || !Array.isArray(ids)) return {};

  const validIds = Array.from(new Set(ids.filter(isEntityId))).slice(
    0,
    MAX_BATCH_IDS
  );
  if (validIds.length === 0 || !likesAvailable()) return {};

  try {
    const visitorId = await getOrCreateVisitorId();

    const [countRows, likedRows] = await Promise.all([
      withDatabaseTimeout(
        prisma.like.groupBy({
          by: ["entityId"],
          where: { entityType, entityId: { in: validIds } },
          _count: { _all: true },
        })
      ),
      withDatabaseTimeout(
        prisma.like.findMany({
          where: { entityType, entityId: { in: validIds }, visitorId },
          select: { entityId: true },
        })
      ),
    ]);

    const likedIds = new Set(likedRows.map((row) => row.entityId));
    const states: Record<string, LikeState> = {};

    for (const id of validIds) states[id] = { liked: false, count: 0 };
    for (const row of countRows) {
      states[row.entityId] = {
        liked: likedIds.has(row.entityId),
        count: row._count._all,
      };
    }

    return states;
  } catch {
    return {};
  }
}

/**
 * Toggles the current visitor's like for one entity.
 * The server is the source of truth: it validates the entity, its visibility
 * and the visitor cookie before writing anything.
 */
export async function toggleLikeAction(
  entityType: LikeEntityType,
  entityId: string
): Promise<LikeToggleResult> {
  if (!isLikeEntityType(entityType)) {
    return { ok: false, error: "Invalid content type." };
  }
  if (!isEntityId(entityId)) {
    return { ok: false, error: "Invalid content id." };
  }
  if (!likesAvailable()) {
    return { ok: false, error: "Likes are temporarily unavailable." };
  }

  try {
    const visitorId = await getOrCreateVisitorId();

    if (await isRateLimitedForVisitor(visitorId)) {
      return { ok: false, error: "Too many requests. Please try again shortly." };
    }

    const eligible = await isEntityEligible(entityType, entityId);
    if (!eligible) {
      return { ok: false, error: "This content cannot be liked." };
    }

    const existing = await prisma.like.findUnique({
      where: {
        entityType_entityId_visitorId: { entityType, entityId, visitorId },
      },
      select: { id: true },
    });

    let liked: boolean;

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      try {
        await prisma.like.create({
          data: { entityType, entityId, visitorId },
        });
        liked = true;
      } catch (error) {
        // Unique constraint hit — a concurrent request already liked it.
        const code = (error as { code?: string })?.code;
        if (code !== "P2002") throw error;
        liked = true;
      }
    }

    const count = await withDatabaseTimeout(
      prisma.like.count({ where: { entityType, entityId } })
    );

    return { ok: true, liked, count };
  } catch (error) {
    console.error("toggleLikeAction error:", error);
    return { ok: false, error: "Could not update your like. Please try again." };
  }
}
