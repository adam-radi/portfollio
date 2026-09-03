"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import { Skill } from "@/types/skill";
import { skills as staticSkills } from "@/data/skills";
import { requireAdminSession } from "@/lib/auth";

const LOCAL_SKILLS_FILE = path.join(process.cwd(), "data", "localSkills.json");

async function readLocalSkills(): Promise<Skill[]> {
  try {
    const raw = await fs.readFile(LOCAL_SKILLS_FILE, "utf-8");
    return JSON.parse(raw) as Skill[];
  } catch (err) {
    // seed local file from static skills
    await fs.mkdir(path.dirname(LOCAL_SKILLS_FILE), { recursive: true }).catch(() => { });
    await fs.writeFile(LOCAL_SKILLS_FILE, JSON.stringify(staticSkills, null, 2), "utf-8");
    return staticSkills;
  }
}

async function writeLocalSkills(skills: Skill[]) {
  await fs.writeFile(LOCAL_SKILLS_FILE, JSON.stringify(skills, null, 2), "utf-8");
}

export async function createSkillAction(data: {
  name: string;
  category: string;
  level: string;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
}) {
  await requireAdminSession();

  try {
    // Try DB first
    const shouldAttemptDb = !!process.env.DATABASE_URL && !!prisma?.skill;
    if (shouldAttemptDb) {
      await prisma.skill.create({
        data: {
          name: data.name,
          category: data.category,
          level: data.level,
          icon: data.icon || null,
          description: data.description || null,
          yearsOfExperience: data.yearsOfExperience ?? 0,
        },
      });

      revalidatePath("/");
      revalidatePath("/dashboard/skills");
      return;
    }
  } catch (err) {
    // fall through to local fallback
  }

  // Local fallback
  const local = await readLocalSkills();
  const newSkill = {
    id: String(Date.now()),
    name: data.name,
    category: data.category,
    level: data.level,
    icon: data.icon || undefined,
    description: data.description || undefined,
    yearsOfExperience: data.yearsOfExperience ?? 0,
  } as Skill;

  local.unshift(newSkill);
  await writeLocalSkills(local);

  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}

export async function updateSkillAction(
  id: string,
  data: {
    name: string;
    category: string;
    level: string;
    icon?: string;
    description?: string;
    yearsOfExperience?: number;
  }
) {
  await requireAdminSession();

  try {
    const shouldAttemptDb = !!process.env.DATABASE_URL && !!prisma?.skill;
    if (shouldAttemptDb) {
      await prisma.skill.update({
        where: { id },
        data: {
          name: data.name,
          category: data.category,
          level: data.level,
          icon: data.icon || null,
          description: data.description || null,
          yearsOfExperience: data.yearsOfExperience ?? 0,
        },
      });

      revalidatePath("/");
      revalidatePath("/dashboard/skills");
      return;
    }
  } catch (err) {
    // fall through to local fallback
  }

  // Local fallback
  const local = await readLocalSkills();
  const idx = local.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Skill not found.");

  local[idx] = {
    ...local[idx],
    name: data.name,
    category: data.category,
    level: data.level,
    icon: data.icon || undefined,
    description: data.description || undefined,
    yearsOfExperience: data.yearsOfExperience ?? local[idx].yearsOfExperience ?? 0,
  } as Skill;

  await writeLocalSkills(local);
  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}

export async function deleteSkillAction(id: string) {
  await requireAdminSession();

  try {
    const shouldAttemptDb = !!process.env.DATABASE_URL && !!prisma?.skill;
    if (shouldAttemptDb) {
      await prisma.skill.delete({
        where: { id },
      });

      revalidatePath("/");
      revalidatePath("/dashboard/skills");
      return;
    }
  } catch (err) {
    // fall through to local fallback
  }

  const local = await readLocalSkills();
  const next = local.filter((s) => s.id !== id);
  await writeLocalSkills(next);
  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}
