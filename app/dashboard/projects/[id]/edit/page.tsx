import React from "react";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/forms/ProjectForm";
import { getProjects } from "@/lib/db/data-fetchers";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const projects = await getProjects();
  const project = projects.find((p) => p.id === id || p.slug === id) || null;

  if (!project) {
    notFound();
  }

  return <ProjectForm mode="edit" initialData={project} />;
}