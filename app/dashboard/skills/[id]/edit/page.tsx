import React from "react";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import SkillForm from "@/components/forms/SkillForm";
import { prisma } from "@/lib/prisma";
import { skills as staticSkills } from "@/data/skills";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

async function readLocalSkills() {
  const localPath = path.join(process.cwd(), "data", "localSkills.json");
  try {
    const raw = await fs.readFile(localPath, "utf-8");
    return JSON.parse(raw) as typeof staticSkills;
  } catch {
    return staticSkills;
  }
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
    // Fallback to local JSON file if DB is unavailable.
  }

  if (!skill) {
    const localSkills = await readLocalSkills();
    const localSkill = localSkills.find((s) => s.id === id);
    if (localSkill) skill = localSkill;
  }

  if (!skill) {
    const staticS = staticSkills.find((s) => s.id === id);
    if (staticS) skill = staticS;
  }

  if (!skill) notFound();

  return <SkillForm mode="edit" initialData={skill} />;
}
