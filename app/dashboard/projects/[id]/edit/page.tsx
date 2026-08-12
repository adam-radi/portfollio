import React from "react";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/forms/ProjectForm";
import { prisma } from "@/lib/prisma";
import { projects as staticProjects } from "@/data/projects";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  let project = null;

  try {
    if (process.env.DATABASE_URL && prisma?.project) {
      const dbProj = await prisma.project.findUnique({
        where: { id },
      });
      if (dbProj) {
        project = {
          ...dbProj,
          features: typeof dbProj.features === "string" ? JSON.parse(dbProj.features) : dbProj.features,
          technologies: typeof dbProj.technologies === "string" ? JSON.parse(dbProj.technologies) : dbProj.technologies,
          challenges: typeof dbProj.challenges === "string" ? JSON.parse(dbProj.challenges) : dbProj.challenges,
          lessonsLearned: typeof dbProj.lessonsLearned === "string" ? JSON.parse(dbProj.lessonsLearned) : dbProj.lessonsLearned,
          githubUrl: dbProj.githubUrl || undefined,
          liveUrl: dbProj.liveUrl || undefined,
          published: typeof dbProj.published === "boolean" ? dbProj.published : true,
        };
      }
    }
  } catch {
    // Fallback to static
  }

  if (!project) {
    const staticP = staticProjects.find((p) => p.id === id || p.slug === id);
    if (staticP) {
      project = staticP;
    }
  }

  if (!project) {
    notFound();
  }

  return <ProjectForm mode="edit" initialData={project} />;
}
