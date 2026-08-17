import React from "react";
import { notFound } from "next/navigation";
import ExperienceForm from "@/components/forms/ExperienceForm";
import { prisma } from "@/lib/prisma";
import { experiences as staticExperiences } from "@/data/experience";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = await params;
  let experience = null;

  try {
    if (process.env.DATABASE_URL && prisma?.experience) {
      const dbExp = await prisma.experience.findUnique({ where: { id } });
      if (dbExp) {
        experience = {
          ...dbExp,
          description: typeof dbExp.description === "string" ? JSON.parse(dbExp.description) : dbExp.description,
          technologies: typeof dbExp.technologies === "string" ? JSON.parse(dbExp.technologies) : dbExp.technologies,
          endDate: dbExp.endDate,
          companyLogo: dbExp.companyLogo || undefined,
        };
      }
    }
  } catch {
    // Fallback to static
  }

  if (!experience) {
    const staticE = staticExperiences.find((e) => e.id === id);
    if (staticE) experience = staticE;
  }

  if (!experience) notFound();

  return <ExperienceForm mode="edit" initialData={experience} />;
}
