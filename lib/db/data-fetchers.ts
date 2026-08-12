import { prisma } from "@/lib/prisma";
import { projects as staticProjects } from "@/data/projects";
import { experiences as staticExperiences } from "@/data/experience";
import { skills as staticSkills } from "@/data/skills";
import { certifications as staticCertifications } from "@/data/certifications";
import { Project } from "@/types/project";
import { Experience } from "@/types/experience";
import { Skill } from "@/types/skill";
import { Certification } from "@/types/certification";
import { Message } from "@/types/message";

// ── Projects Fetcher ────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.project) return staticProjects;
    const dbProjects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    if (dbProjects.length === 0) return staticProjects;
    return dbProjects.map((p: any) => ({
      ...p,
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      published: typeof p.published === "boolean" ? p.published : true,
    }));
  } catch (error) {
    return staticProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.project) {
      return staticProjects.find((p) => p.slug === slug) || null;
    }
    const p = await prisma.project.findUnique({
      where: { slug },
    });
    if (!p) return staticProjects.find((proj) => proj.slug === slug) || null;
    return {
      ...p,
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
    };
  } catch (error) {
    return staticProjects.find((p) => p.slug === slug) || null;
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
    return dbExperiences;
  } catch (error) {
    return staticExperiences;
  }
}

// ── Skills Fetcher ──────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.skill) return staticSkills;
    const dbSkills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    if (dbSkills.length === 0) return staticSkills;
    return dbSkills as Skill[];
  } catch (error) {
    return staticSkills;
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
    return dbCerts.map((c: any) => ({
      ...c,
      credentialUrl: c.credentialUrl || undefined,
      image: c.image || undefined,
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
