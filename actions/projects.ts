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

type ProjectPayload = {
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
};

function projectData(data: ProjectPayload) {
  return {
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
  };
}

function revalidateProjectRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/dashboard/projects");
}

export async function createProjectAction(data: ProjectPayload) {
  try {
    if (process.env.DATABASE_URL && prisma?.project) {
      const order = (await prisma.project.count()) + 1;
      await prisma.project.upsert({
        where: { slug: data.slug },
        update: projectData(data),
        create: { ...projectData(data), order },
      });

      revalidateProjectRoutes(data.slug);
      return;
    }
  } catch (error) {
    console.error("createProjectAction DB error:", error);
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Could not save project. The database is not reachable — verify the DATABASE_URL environment variable."
      );
    }
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

export async function updateProjectAction(id: string, data: ProjectPayload) {
  if (process.env.DATABASE_URL && prisma?.project) {
    try {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Project not found in database." };
      }
      await prisma.project.update({ where: { id }, data: projectData(data) });
      revalidateProjectRoutes(data.slug);
      return { success: true };
    } catch (error) {
      console.error("updateProjectAction DB error:", error);
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "Could not save project. The database is not reachable — verify the DATABASE_URL environment variable."
        );
      }
      return { success: false, error: "Database error occurred." };
    }
  }

  // Database unavailable — fall back to local storage
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
  if (process.env.DATABASE_URL && prisma?.project) {
    try {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Project not found in database." };
      }
      await prisma.project.delete({ where: { id } });
      revalidatePath("/");
      revalidatePath("/dashboard/projects");
      return { success: true };
    } catch (error) {
      console.error("deleteProjectAction DB error:", error);
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "Could not delete project. The database is not reachable — verify the DATABASE_URL environment variable."
        );
      }
      return { success: false, error: "Database error occurred." };
    }
  }

  // Database unavailable — fall back to local storage
  const local = await readLocalProjects();
  const next = local.filter((project) => project.id !== id);
  if (next.length === local.length) throw new Error("Project not found.");

  await writeLocalProjects(next);

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

export async function toggleFeaturedProjectAction(id: string, featured: boolean) {
  if (process.env.DATABASE_URL && prisma?.project) {
    try {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Project not found in database." };
      }
      await prisma.project.updateMany({
        where: { id },
        data: { featured },
      });

      revalidatePath("/");
      revalidatePath("/dashboard/projects");
      return { success: true };
    } catch (error) {
      console.error("toggleFeaturedProjectAction DB error:", error);
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "Could not update project. The database is not reachable — verify the DATABASE_URL environment variable."
        );
      }
      return { success: false, error: "Database error occurred." };
    }
  }

  // Database unavailable — fall back to local storage
  const local = await readLocalProjects();
  const index = local.findIndex((project) => project.id === id);
  if (index === -1) throw new Error("Project not found.");

  local[index] = { ...local[index], featured };
  await writeLocalProjects(local);

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}
