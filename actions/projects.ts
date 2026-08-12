"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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
  if (!process.env.DATABASE_URL || !prisma?.project) {
    throw new Error("Database not connected. Please configure DATABASE_URL.");
  }

  await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      overview: data.overview,
      problem: data.problem,
      solution: data.solution,
      features: JSON.stringify(data.features),
      technologies: JSON.stringify(data.technologies),
      challenges: JSON.stringify(data.challenges),
      lessonsLearned: JSON.stringify(data.lessonsLearned),
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
  if (!process.env.DATABASE_URL || !prisma?.project) {
    throw new Error("Database not connected. Please configure DATABASE_URL.");
  }

  await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      overview: data.overview,
      problem: data.problem,
      solution: data.solution,
      features: JSON.stringify(data.features),
      technologies: JSON.stringify(data.technologies),
      challenges: JSON.stringify(data.challenges),
      lessonsLearned: JSON.stringify(data.lessonsLearned),
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
}

export async function deleteProjectAction(id: string) {
  if (!process.env.DATABASE_URL || !prisma?.project) {
    throw new Error("Database not connected.");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

export async function toggleFeaturedProjectAction(id: string, featured: boolean) {
  if (!process.env.DATABASE_URL || !prisma?.project) {
    throw new Error("Database not connected.");
  }

  await prisma.project.update({
    where: { id },
    data: { featured },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}
