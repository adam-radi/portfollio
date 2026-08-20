import { prisma } from "@/lib/prisma";
import { projects as staticProjects } from "@/data/projects";
import { experiences as staticExperiences } from "@/data/experience";
import { skills as staticSkills } from "@/data/skills";
import { promises as fs } from "fs";
import path from "path";
import { certifications as staticCertifications } from "@/data/certifications";
import { Project } from "@/types/project";
import { Experience } from "@/types/experience";
import { Skill } from "@/types/skill";
import { Certification } from "@/types/certification";
import { Message } from "@/types/message";

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
  return typeof value === "string" && /�|Ã|Â|â|ð|Ô|Ù|Ø/.test(value);
}

function readableText(value: string | null | undefined, fallback = ""): string {
  return value && !isCorruptedText(value) ? value : fallback;
}

function readableArray(value: unknown, fallback: string[] = []): string[] {
  const values = asStringArray(value);
  return values.length > 0 && !values.some(isCorruptedText) ? values : fallback;
}

async function readLocalProjects(): Promise<Project[]> {
  const localPath = path.join(process.cwd(), "data", "localProjects.json");
  try {
    const raw = await fs.readFile(localPath, "utf-8");
    return JSON.parse(raw) as Project[];
  } catch {
    try {
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, JSON.stringify(staticProjects, null, 2), "utf-8");
    } catch { }
    return staticProjects;
  }
}

async function writeLocalProjects(projects: Project[]) {
  const localPath = path.join(process.cwd(), "data", "localProjects.json");
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, JSON.stringify(projects, null, 2), "utf-8");
}

export async function getProjects(): Promise<Project[]> {
  const candidates: Project[] = [];

  if (process.env.DATABASE_URL && prisma?.project) {
    try {
      const dbProjects = await prisma.project.findMany({
        orderBy: { order: "asc" },
      });
      candidates.push(
        ...dbProjects.map((p): Project => ({
          ...p,
          githubUrl: p.githubUrl || undefined,
          liveUrl: p.liveUrl || undefined,
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

  candidates.push(...(await readLocalProjects()));

  // Merge sources (database first, static as fallback) so no project ever disappears.
  const merged = new Map<string, Project>();
  for (const project of candidates) {
    if (!merged.has(project.slug)) {
      merged.set(project.slug, project);
    }
  }
  const list = Array.from(merged.values());

  if (process.env.NODE_ENV !== "production") {
    try {
      await writeLocalProjects(list);
    } catch {}
  }
  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.project) {
      const localProjects = await readLocalProjects();
      return localProjects.find((p) => p.slug === slug) || null;
    }
    const p = await prisma.project.findUnique({
      where: { slug },
    });
    if (!p) {
      const localProjects = await readLocalProjects();
      return localProjects.find((proj) => proj.slug === slug) || null;
    }
    return {
      ...p,
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      features: asStringArray(p.features),
      technologies: asStringArray(p.technologies),
      challenges: asStringArray(p.challenges),
      lessonsLearned: asStringArray(p.lessonsLearned),
    };
  } catch (error) {
    const localProjects = await readLocalProjects();
    return localProjects.find((p) => p.slug === slug) || null;
  }
}

// ── Experiences Fetcher ─────────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.experience) return staticExperiences;
    const dbExperiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
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
    const localPath = path.join(process.cwd(), "data", "localSkills.json");
    try {
      const raw = await fs.readFile(localPath, "utf-8");
      return JSON.parse(raw) as Skill[];
    } catch (err) {
      // create file from staticSkills if missing
      try {
        await fs.mkdir(path.dirname(localPath), { recursive: true });
        await fs.writeFile(localPath, JSON.stringify(staticSkills, null, 2), "utf-8");
      } catch { }
      return staticSkills;
    }
  }

  try {
    if (!process.env.DATABASE_URL || !prisma?.skill) return await readLocalSkills();
    const dbSkills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
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
  try {
    if (!process.env.DATABASE_URL || !prisma?.certification) return staticCertifications;
    const dbCerts = await prisma.certification.findMany({
      orderBy: { order: "asc" },
    });
    if (dbCerts.length === 0) return staticCertifications;
    return dbCerts.map((c): Certification => ({
      ...c,
      credentialUrl: c.credentialUrl || undefined,
      image: c.image || undefined,
      expirationDate: c.expirationDate || undefined,
      credentialId: c.credentialId || undefined,
      description: c.description || undefined,
    }));
  } catch (error) {
    return staticCertifications;
  }
}

// â”€â”€ Messages Fetcher â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getMessages(): Promise<Message[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.message) return [];
    return await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return [];
  }
}
