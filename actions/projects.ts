"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import { Project } from "@/types/project";
import { projects as staticProjects } from "@/data/projects";

const LOCAL_PROJECTS_FILE = path.join(process.cwd(), "data", "localProjects.json");

async function readLocalProjects(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(LOCAL_PROJECTS_FILE, "utf-8");
    return JSON.parse(raw) as Project[];
  } catch {
    try {
      await fs.mkdir(path.dirname(LOCAL_PROJECTS_FILE), { recursive: true });
      await fs.writeFile(LOCAL_PROJECTS_FILE, JSON.stringify(staticProjects, null, 2), "utf-8");
    } catch {}
    return staticProjects;
  }
}

async function writeLocalProjects(projects: Project[]) {
  await fs.writeFile(LOCAL_PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export async function createProjectAction(data: {
  title: string;
  slug: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  challenges: string[];
  lessonsLearned: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  published: boolean;
}) {
  try {
    if (process.env.DATABASE_URL && prisma?.project) {
      await prisma.project.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          overview: data.overview,
          problem: data.problem,
          solution: data.solution,
          features: data.features,
          technologies: data.technologies,
          challenges: data.challenges,
          lessonsLearned: data.lessonsLearned,
          image: data.image || "/images/projects/placeholder.png",
          githubUrl: data.githubUrl || null,
          liveUrl: data.liveUrl || null,
          featured: data.featured,
          published: data.published,
        },
      });

      revalidatePath("/");
      revalidatePath(`/projects/${data.slug}`);
      revalidatePath("/dashboard/projects");
      return;
    }
  } catch {
    // fallback to local file
  }

  const local = await readLocalProjects();
  const newProject: Project = {
    id: String(Date.now()),
    title: data.title,
    slug: data.slug,
    description: data.description,
    overview: data.overview,
    problem: data.problem,
    solution: data.solution,
    features: data.features,
    technologies: data.technologies,
    challenges: data.challenges,
    lessonsLearned: data.lessonsLearned,
    image: data.image || "/images/projects/placeholder.png",
    githubUrl: data.githubUrl || undefined,
    liveUrl: data.liveUrl || undefined,
    featured: data.featured,
    published: data.published,
    order: local.length + 1,
  };

  local.unshift(newProject);
  await writeLocalProjects(local);

  revalidatePath("/");
  revalidatePath(`/projects/${data.slug}`);
  revalidatePath("/dashboard/projects");
}

export async function updateProjectAction(
  id: string,
  data: {
    title: string;
    slug: string;
    description: string;
    overview: string;
    problem: string;
    solution: string;
    features: string[];
    technologies: string[];
    challenges: string[];
    lessonsLearned: string[];
    image: string;
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
    published: boolean;
  }
) {
  try {
    if (process.env.DATABASE_URL && prisma?.project) {
      await prisma.project.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          overview: data.overview,
          problem: data.problem,
          solution: data.solution,
          features: data.features,
          technologies: data.technologies,
          challenges: data.challenges,
          lessonsLearned: data.lessonsLearned,
          image: data.image || "/images/projects/placeholder.png",
          githubUrl: data.githubUrl || null,
          liveUrl: data.liveUrl || null,
          featured: data.featured,
          published: data.published,
        },
      });

      revalidatePath("/");
      revalidatePath(`/projects/${data.slug}`);
      revalidatePath("/dashboard/projects");
      return;
    }
  } catch {
    // fallback to local file
  }

  const local = await readLocalProjects();
  const index = local.findIndex((project) => project.id === id);
  if (index === -1) throw new Error("Project not found.");

  local[index] = {
    ...local[index],
    title: data.title,
    slug: data.slug,
    description: data.description,
    overview: data.overview,
    problem: data.problem,
    solution: data.solution,
    features: data.features,
    technologies: data.technologies,
    challenges: data.challenges,
    lessonsLearned: data.lessonsLearned,
    image: data.image || "/images/projects/placeholder.png",
    githubUrl: data.githubUrl || undefined,
    liveUrl: data.liveUrl || undefined,
    featured: data.featured,
    published: data.published,
  };

  await writeLocalProjects(local);

  revalidatePath("/");
  revalidatePath(`/projects/${data.slug}`);
  revalidatePath("/dashboard/projects");
}

export async function deleteProjectAction(id: string) {
  try {
    if (process.env.DATABASE_URL && prisma?.project) {
      await prisma.project.delete({
        where: { id },
      });

      revalidatePath("/");
      revalidatePath("/dashboard/projects");
      return;
    }
  } catch {
    // fallback to local file
  }

  const local = await readLocalProjects();
  const next = local.filter((project) => project.id !== id);
  await writeLocalProjects(next);

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

export async function toggleFeaturedProjectAction(id: string, featured: boolean) {
  try {
    if (process.env.DATABASE_URL && prisma?.project) {
      await prisma.project.update({
        where: { id },
        data: { featured },
      });

      revalidatePath("/");
      revalidatePath("/dashboard/projects");
      return;
    }
  } catch {
    // fallback to local file
  }

  const local = await readLocalProjects();
  const index = local.findIndex((project) => project.id === id);
  if (index === -1) throw new Error("Project not found.");

  local[index] = { ...local[index], featured };
  await writeLocalProjects(local);

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}
