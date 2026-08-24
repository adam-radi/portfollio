import React from "react";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/forms/ProjectForm";
import { Project } from "@/types/project";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Type guard to safely convert Prisma JsonArray to string[]
function toStringArray(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  let project: Project | null = null;

  if (process.env.DATABASE_URL && prisma?.project) {
    // Get project directly from Prisma/MySQL when DB is available
    const prismaResult = await prisma.project.findUnique({ where: { id } });
    // Map Prisma result to Project shape with safe JSON array conversion
    project = prismaResult
      ? {
          id: prismaResult.id,
          title: prismaResult.title,
          slug: prismaResult.slug,
          description: prismaResult.description,
          overview: prismaResult.overview,
          problem: prismaResult.problem,
          solution: prismaResult.solution,
          technologies: toStringArray(prismaResult.technologies),
          features: toStringArray(prismaResult.features),
          challenges: toStringArray(prismaResult.challenges),
          lessonsLearned: toStringArray(prismaResult.lessonsLearned),
          image: prismaResult.image ?? "/images/projects/placeholder.png",
          githubUrl: prismaResult.githubUrl,
          liveUrl: prismaResult.liveUrl,
          featured: prismaResult.featured,
          published: prismaResult.published,
          order: prismaResult.order,
          createdAt: prismaResult.createdAt,
          updatedAt: prismaResult.updatedAt,
        }
      : null;
  } else {
    // Fall back to merged dataset when DB unavailable
    const { getProjects } = await import("@/lib/db/data-fetchers");
    const projects = await getProjects();
    const found = projects.find((p) => p.id === id || p.slug === id);
    if (found) {
      project = {
        id: found.id,
        title: found.title,
        slug: found.slug,
        description: found.description,
        overview: found.overview,
        problem: found.problem,
        solution: found.solution,
        technologies: found.technologies ?? [],
        features: found.features ?? [],
        challenges: found.challenges ?? [],
        lessonsLearned: found.lessonsLearned ?? [],
        image: found.image || "/images/projects/placeholder.png",
        githubUrl: found.githubUrl,
        liveUrl: found.liveUrl,
        featured: found.featured,
        published: found.published,
        order: found.order,
        createdAt: found.createdAt ?? new Date(),
        updatedAt: found.updatedAt ?? new Date(),
      };
    }
  }

  if (!project) {
    notFound();
  }

  return <ProjectForm mode="edit" initialData={project} />;
}