import React from "react";
import { notFound } from "next/navigation";
import SkillForm from "@/components/forms/SkillForm";
import { prisma } from "@/lib/prisma";
import { skills as staticSkills } from "@/data/skills";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  let skill = null;

  try {
    if (process.env.DATABASE_URL && prisma?.skill) {
      const dbSkill = await prisma.skill.findUnique({ where: { id } });
      if (dbSkill) {
          skill = {
            ...dbSkill,
            icon: dbSkill.icon || undefined,
            level: dbSkill.level as "beginner" | "intermediate" | "advanced" | "expert",
            category: dbSkill.category as (typeof staticSkills)[number]["category"],
            description: dbSkill.description || undefined,
            yearsOfExperience: dbSkill.yearsOfExperience ?? undefined,
          };
      }
    }
  } catch {
    // Fallback
  }

  if (!skill) {
    const staticS = staticSkills.find((s) => s.id === id);
    if (staticS) skill = staticS;
  }

  if (!skill) notFound();

  return <SkillForm mode="edit" initialData={skill} />;
}
