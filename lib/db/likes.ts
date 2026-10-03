import { prisma } from "@/lib/prisma";
import { withDatabaseTimeout } from "@/lib/db/data-fetchers";
import type { LikeCounts, LikeEntityType, LikeStats, LikeTopEntry } from "@/types/like";

export function likesAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL && prisma?.like);
}

function emptyStats(): LikeStats {
  return {
    total: 0,
    byType: { PROJECT: 0, SKILL: 0, ARTICLE: 0, REVIEW: 0 },
    topProject: null,
    topArticle: null,
  };
}

/**
 * Batched like counts for a single entity type.
 * One grouped query per call — never one query per card/item.
 */
export async function getLikeCounts(
  entityType: LikeEntityType,
  ids: string[]
): Promise<LikeCounts> {
  const counts: LikeCounts = {};
  if (ids.length === 0 || !likesAvailable()) return counts;

  try {
    const rows = await withDatabaseTimeout(
      prisma.like.groupBy({
        by: ["entityId"],
        where: { entityType, entityId: { in: ids } },
        _count: { _all: true },
      })
    );
    for (const row of rows) {
      counts[row.entityId] = row._count._all;
    }
  } catch {
    // Database unreachable — the UI falls back to a count of 0.
  }

  return counts;
}

async function countByType(entityType: LikeEntityType): Promise<number> {
  if (!likesAvailable()) return 0;
  try {
    return await withDatabaseTimeout(prisma.like.count({ where: { entityType } }));
  } catch {
    return 0;
  }
}

async function topEntry(
  entityType: LikeEntityType,
  fetchTitle: (id: string) => Promise<string | null>
): Promise<LikeTopEntry | null> {
  if (!likesAvailable()) return null;
  try {
    const rows = await withDatabaseTimeout(
      prisma.like.groupBy({
        by: ["entityId"],
        where: { entityType },
        orderBy: { _count: { entityId: "desc" } },
        take: 1,
        _count: { _all: true },
      })
    );
    const top = rows[0];
    if (!top) return null;

    const title = await fetchTitle(top.entityId);
    if (!title) return null;

    return { id: top.entityId, title, count: top._count._all };
  } catch {
    return null;
  }
}

/** Dashboard summary — a handful of grouped queries, no N+1. */
export async function getLikeStats(): Promise<LikeStats> {
  if (!likesAvailable()) return emptyStats();

  try {
    const [total, byProject, bySkill, byArticle, byReview, topProject, topArticle] =
      await Promise.all([
        withDatabaseTimeout(prisma.like.count()),
        countByType("PROJECT"),
        countByType("SKILL"),
        countByType("ARTICLE"),
        countByType("REVIEW"),
        topEntry("PROJECT", async (id) => {
          const project = await prisma.project.findUnique({
            where: { id },
            select: { title: true },
          });
          return project?.title ?? null;
        }),
        topEntry("ARTICLE", async (id) => {
          const article = await prisma.article.findUnique({
            where: { id },
            select: { title: true },
          });
          return article?.title ?? null;
        }),
      ]);

    return {
      total,
      byType: {
        PROJECT: byProject,
        SKILL: bySkill,
        ARTICLE: byArticle,
        REVIEW: byReview,
      },
      topProject,
      topArticle,
    };
  } catch {
    return emptyStats();
  }
}
