"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createSkillAction(data: {
  name: string;
  category: string;
  level: string;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
}) {
  if (!process.env.DATABASE_URL || !prisma?.skill) {
    throw new Error("Database not connected.");
  }

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
  if (!process.env.DATABASE_URL || !prisma?.skill) {
    throw new Error("Database not connected.");
  }

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
}

export async function deleteSkillAction(id: string) {
  if (!process.env.DATABASE_URL || !prisma?.skill) {
    throw new Error("Database not connected.");
  }

  await prisma.skill.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}
