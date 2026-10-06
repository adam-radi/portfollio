import { prisma } from "@/lib/prisma";
import { projects as staticProjects } from "@/data/projects";
import { experiences as staticExperiences } from "@/data/experience";
import { skills as staticSkills } from "@/data/skills";
import localProjectsJson from "@/data/localProjects.json";
import localSkillsJson from "@/data/localSkills.json";
import { promises as fs } from "fs";
import path from "path";
import { certifications as staticCertifications } from "@/data/certifications";
import { Project } from "@/types/project";
import { Experience } from "@/types/experience";
import { Skill } from "@/types/skill";
import { Certification } from "@/types/certification";
import { Message } from "@/types/message";
import { Article } from "@/types/article";
import {
  Review,
  ReviewSource,
  REVIEW_SOURCES,
  REVIEW_SOURCE_LABELS,
} from "@/types/review";

// ── Database Timeout Guard ──────────────────────────────────

export function withDatabaseTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Database operation timed out after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

// ── Projects Fetcher ────────────────────────────────────────

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    } catch { }
  }
  return [];
}

// Some older database rows were saved with an incorrect character encoding.
// Keep valid custom content, but use the bundled UTF-8 value when corruption is
// detectable (replacement characters or common UTF-8-as-Latin-1 sequences).
function isCorruptedText(value: unknown): boolean {
  return typeof value === "string" && /\uFFFD|Ã|Â|â|ð|Ô|Ù|Ø/.test(value);
}

function readableText(value: string | null | undefined, fallback = ""): string {
  return value && !isCorruptedText(value) ? value : fallback;
}

function readableArray(value: unknown, fallback: string[] = []): string[] {
  const values = asStringArray(value);
  return values.length > 0 && !values.some(isCorruptedText) ? values : fallback;
}

async function readLocalProjects(): Promise<Project[]> {
  try {
    const localPath = path.join(process.cwd(), "data", "localProjects.json");
    const raw = await fs.readFile(localPath, "utf-8");
    return JSON.parse(raw) as Project[];
  } catch {
    return localProjectsJson as unknown as Project[];
  }
}

async function writeLocalProjects(projects: Project[]) {
  const localPath = path.join(process.cwd(), "data", "localProjects.json");
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, JSON.stringify(projects, null, 2), "utf-8");
}

function cleanSlug(slug: string, fallbackTitle: string): string {
  if (!slug || typeof slug !== "string") {
    return fallbackTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  let s = slug.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.includes("/") || s.includes("?")) {
    try {
      const url = new URL(s.startsWith("http") ? s : `https://${s}`);
      const pathSegments = url.pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0) {
        s = pathSegments[pathSegments.length - 1];
      } else {
        const hostParts = url.hostname.split(".").filter((p) => p !== "www" && p !== "com" && p !== "xo" && p !== "je");
        s = hostParts[0] || fallbackTitle;
      }
    } catch {
      s = s.replace(/https?:\/\//g, "").replace(/[^a-z0-9-]+/gi, "-");
    }
  }
  const sanitized = s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  return sanitized || fallbackTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getProjects(): Promise<Project[]> {
  const candidates: Project[] = [];

  if (process.env.DATABASE_URL && prisma?.project) {
    try {
      const dbProjects = await withDatabaseTimeout(
        prisma.project.findMany({
          orderBy: { order: "asc" },
        })
      );
      candidates.push(
        ...dbProjects.map((p): Project => ({
          ...p,
          slug: cleanSlug(p.slug, p.title),
          githubUrl: p.githubUrl ?? null,
          liveUrl: p.liveUrl ?? null,
          published: typeof p.published === "boolean" ? p.published : true,
          features: asStringArray(p.features),
          technologies: asStringArray(p.technologies),
          challenges: asStringArray(p.challenges),
          lessonsLearned: asStringArray(p.lessonsLearned),
        }))
      );
    } catch {
      // DB unreachable — continue with local/static data
    }
  }

  const rawLocal = await readLocalProjects();
  const localCandidates: Project[] = rawLocal.map((p) => ({
    id: p.id,
    title: p.title,
    slug: cleanSlug(p.slug, p.title),
    description: p.description ?? "",
    overview: p.overview ?? "",
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    technologies: asStringArray(p.technologies),
    features: asStringArray(p.features),
    challenges: asStringArray(p.challenges),
    lessonsLearned: asStringArray(p.lessonsLearned),
    image: p.image || "/images/projects/placeholder.png",
    githubUrl: p.githubUrl ?? null,
    liveUrl: p.liveUrl ?? null,
    featured: Boolean(p.featured),
    published: p.published ?? true,
    order: p.order ?? 0,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }));
  candidates.push(...localCandidates);

  // Merge sources (database first, static as fallback) so no project ever disappears or duplicates.
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const list: Project[] = [];
  for (const project of candidates) {
    if (project.id && project.slug && !seenIds.has(project.id) && !seenSlugs.has(project.slug)) {
      seenIds.add(project.id);
      seenSlugs.add(project.slug);
      list.push(project);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      await writeLocalProjects(list);
    } catch {}
  }
  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const allProjects = await getProjects();
  const found = allProjects.find((p) => p.slug === slug || p.id === slug);
  if (found) return found;

  const targetClean = cleanSlug(slug, "");
  if (targetClean) {
    const matchedClean = allProjects.find((p) => p.slug === targetClean);
    if (matchedClean) return matchedClean;
  }

  return null;
}

// ── Experiences Fetcher ─────────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.experience) return staticExperiences;
    const dbExperiences = await withDatabaseTimeout(
      prisma.experience.findMany({
        orderBy: { order: "asc" },
      })
    );
    if (dbExperiences.length === 0) return staticExperiences;
    return dbExperiences.map((e): Experience => {
      const fallback = staticExperiences.find((item) => item.id === e.id);
      return {
        ...e,
        company: readableText(e.company, fallback?.company),
        role: readableText(e.role, fallback?.role),
        location: readableText(e.location, fallback?.location),
        description: readableArray(e.description, fallback?.description),
        technologies: readableArray(e.technologies, fallback?.technologies),
        companyLogo: e.companyLogo || undefined,
      };
    });
  } catch (error) {
    return staticExperiences;
  }
}

// ── Skills Fetcher ──────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  async function readLocalSkills(): Promise<Skill[]> {
    try {
      const localPath = path.join(process.cwd(), "data", "localSkills.json");
      const raw = await fs.readFile(localPath, "utf-8");
      return JSON.parse(raw) as Skill[];
    } catch {
      return (localSkillsJson as unknown as Skill[]) || staticSkills;
    }
  }

  try {
    if (!process.env.DATABASE_URL || !prisma?.skill) return await readLocalSkills();
    const dbSkills = await withDatabaseTimeout(
      prisma.skill.findMany({
        orderBy: { order: "asc" },
      })
    );
    if (dbSkills.length === 0) return await readLocalSkills();
    return dbSkills.map((skill): Skill => {
      const fallback = staticSkills.find((item) => item.id === skill.id);
      return {
        ...skill,
        name: readableText(skill.name, fallback?.name),
        category: readableText(skill.category, fallback?.category) as Skill["category"],
        level: readableText(skill.level, fallback?.level) as Skill["level"],
        description: readableText(skill.description, fallback?.description),
        yearsOfExperience: skill.yearsOfExperience ?? fallback?.yearsOfExperience,
        // Icons are short Unicode values and were especially affected by the
        // old encoding issue; prefer the known UTF-8 icon when available.
        icon: fallback?.icon || readableText(skill.icon, ""),
      };
    });
  } catch (error) {
    return await readLocalSkills();
  }
}

// ── Certifications Fetcher ──────────────────────────────────

export async function getCertifications(): Promise<Certification[]> {
  async function readLocalCertifications(): Promise<Certification[]> {
    try {
      const localPath = path.join(process.cwd(), "data", "localCertifications.json");
      const raw = await fs.readFile(localPath, "utf-8");
      return JSON.parse(raw) as Certification[];
    } catch {
      return staticCertifications;
    }
  }

  try {
    if (!process.env.DATABASE_URL || !prisma?.certification) return await readLocalCertifications();
    const dbCerts = await withDatabaseTimeout(
      prisma.certification.findMany({
        orderBy: { order: "asc" },
      })
    );
    if (dbCerts.length === 0) return await readLocalCertifications();
    return dbCerts.map((c): Certification => ({
      ...c,
      credentialUrl: c.credentialUrl || undefined,
      image: c.image || undefined,
      expirationDate: c.expirationDate || undefined,
      credentialId: c.credentialId || undefined,
      description: c.description || undefined,
    }));
  } catch (error) {
    return await readLocalCertifications();
  }
}

// ── Messages Fetcher ────────────────────────────────────────

export async function getMessages(): Promise<Message[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.message) return [];
    return await withDatabaseTimeout(
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
      })
    );
  } catch (error) {
    return [];
  }
}

// ── Articles Fetchers ────────────────────────────────────────

export async function getPublishedArticles(): Promise<Article[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.article) return [];
    const rows = await withDatabaseTimeout(
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      })
    );
    return rows.map((a): Article => ({
      ...a,
      tags: asStringArray(a.tags),
      coverImage: a.coverImage ?? null,
      publishedAt: a.publishedAt ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.article) return null;
    const a = await withDatabaseTimeout(
      prisma.article.findUnique({ where: { slug } })
    );
    if (!a || a.status !== "PUBLISHED") return null;
    return {
      ...a,
      tags: asStringArray(a.tags),
      coverImage: a.coverImage ?? null,
      publishedAt: a.publishedAt ?? null,
    };
  } catch {
    return null;
  }
}

export async function getRelatedArticles(
  articleId: string,
  category: string,
  tags: string[],
  limit = 3
): Promise<Article[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.article) return [];

    // Only ever consider PUBLISHED articles, then rank:
    // 1) same category, 2) shared tags, 3) most recent.
    const candidates = await withDatabaseTimeout(
      prisma.article.findMany({
        where: { status: "PUBLISHED", id: { not: articleId } },
        orderBy: { publishedAt: "desc" },
      })
    );

    const ranked = candidates
      .map((a) => {
        const candidateTags = asStringArray(a.tags);
        const sharedTags = tags.filter((t) => candidateTags.includes(t)).length;
        const score = (a.category === category ? 2 : 0) + Math.min(sharedTags, 2);
        return { article: a, score };
      })
      .sort((x, y) => y.score - x.score)
      .slice(0, limit)
      .map(({ article }): Article => ({
        ...article,
        tags: asStringArray(article.tags),
        coverImage: article.coverImage ?? null,
        publishedAt: article.publishedAt ?? null,
      }));

    return ranked;
  } catch {
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.article) return null;
    const a = await withDatabaseTimeout(
      prisma.article.findUnique({ where: { id } })
    );
    if (!a) return null;
    return {
      ...a,
      tags: asStringArray(a.tags),
      coverImage: a.coverImage ?? null,
      publishedAt: a.publishedAt ?? null,
    };
  } catch {
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.article) return [];
    const rows = await withDatabaseTimeout(
      prisma.article.findMany({
        orderBy: { createdAt: "desc" },
      })
    );
    return rows.map((a): Article => ({
      ...a,
      tags: asStringArray(a.tags),
      coverImage: a.coverImage ?? null,
      publishedAt: a.publishedAt ?? null,
    }));
  } catch {
    return [];
  }
}

// ── Reviews Fetchers ────────────────────────────────────────

// Public: only APPROVED reviews are ever returned. PENDING and REJECTED
// reviews must never reach the public site.
export async function getApprovedReviews(): Promise<Review[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.review) return [];
    return await withDatabaseTimeout(
      prisma.review.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    );
  } catch {
    return [];
  }
}

// Admin: all reviews regardless of status.
export async function getAllReviews(): Promise<Review[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.review) return [];
    return await withDatabaseTimeout(
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
      })
    );
  } catch {
    return [];
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.review) return null;
    return await withDatabaseTimeout(
      prisma.review.findUnique({ where: { id } })
    );
  } catch {
    return null;
  }
}

// ── Review Statistics (dashboard) ────────────────────────────
//
// Moderation rules stay in charge: the headline acquisition breakdown counts
// APPROVED reviews only (that is what the public site actually shows), while
// a second breakdown reports every submission regardless of status.
// Rows stored before the source field existed have a NULL source and are
// reported as "Not specified" — their source is never invented.

export interface ReviewSourceStat {
  source: ReviewSource;
  label: string;
  count: number;
  percentage: number;
}

export interface ReviewDashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  /** Percentage denominator: all approved reviews (NULL source included). */
  approvedBySource: ReviewSourceStat[];
  approvedUnspecified: number;
  /** Percentage denominator: every submitted review, any status. */
  submittedBySource: ReviewSourceStat[];
  submittedUnspecified: number;
}

function emptyReviewStats(): ReviewDashboardStats {
  return {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    approvedBySource: REVIEW_SOURCES.map((source) => ({
      source,
      label: REVIEW_SOURCE_LABELS[source],
      count: 0,
      percentage: 0,
    })),
    approvedUnspecified: 0,
    submittedBySource: REVIEW_SOURCES.map((source) => ({
      source,
      label: REVIEW_SOURCE_LABELS[source],
      count: 0,
      percentage: 0,
    })),
    submittedUnspecified: 0,
  };
}

/** Percentage of `count` in `total`. Never divides by zero. */
function percentageOf(count: number, total: number): number {
  if (total <= 0 || count <= 0) return 0;
  return Math.round((count / total) * 100);
}

function buildBreakdown(
  counts: Partial<Record<ReviewSource, number>>,
  total: number
): ReviewSourceStat[] {
  return REVIEW_SOURCES.map((source) => ({
    source,
    label: REVIEW_SOURCE_LABELS[source],
    count: counts[source] || 0,
    percentage: percentageOf(counts[source] || 0, total),
  }));
}

export async function getReviewStats(): Promise<ReviewDashboardStats> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.review) return emptyReviewStats();

    // One grouped query per scope — status × source, aggregated in JS.
    const rows = await withDatabaseTimeout(
      prisma.review.groupBy({
        by: ["status", "source"],
        _count: { _all: true },
      })
    );

    const stats = emptyReviewStats();
    const approvedCounts: Partial<Record<ReviewSource, number>> = {};
    const submittedCounts: Partial<Record<ReviewSource, number>> = {};
    let unspecified = 0; // rows with no recorded source, any status

    for (const row of rows) {
      const count = row._count._all;
      stats.total += count;

      if (row.status === "APPROVED") stats.approved += count;
      else if (row.status === "PENDING") stats.pending += count;
      else if (row.status === "REJECTED") stats.rejected += count;

      if (row.source) {
        submittedCounts[row.source] = (submittedCounts[row.source] || 0) + count;
        if (row.status === "APPROVED") {
          approvedCounts[row.source] = (approvedCounts[row.source] || 0) + count;
        }
      } else {
        unspecified += count;
        if (row.status === "APPROVED") stats.approvedUnspecified += count;
      }
    }

    stats.submittedUnspecified = unspecified;
    stats.approvedBySource = buildBreakdown(approvedCounts, stats.approved);
    stats.submittedBySource = buildBreakdown(submittedCounts, stats.total);

    return stats;
  } catch {
    return emptyReviewStats();
  }
}
