"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function createExperienceAction(data: {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string[];
  technologies: string[];
  companyLogo?: string;
}) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.experience) {
    throw new Error("Database not connected.");
  }

  await prisma.experience.create({
    data: {
      company: data.company,
      role: data.role,
      location: data.location,
      startDate: data.startDate,
      endDate: data.current ? null : data.endDate || null,
      current: data.current,
      description: data.description,
      technologies: data.technologies,
      companyLogo: data.companyLogo || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/experience");
}

export async function updateExperienceAction(
  id: string,
  data: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate?: string | null;
    current: boolean;
    description: string[];
    technologies: string[];
    companyLogo?: string;
  }
) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.experience) {
    throw new Error("Database not connected.");
  }

  await prisma.experience.update({
    where: { id },
    data: {
      company: data.company,
      role: data.role,
      location: data.location,
      startDate: data.startDate,
      endDate: data.current ? null : data.endDate || null,
      current: data.current,
      description: data.description,
      technologies: data.technologies,
      companyLogo: data.companyLogo || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/experience");
}

export async function deleteExperienceAction(id: string) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.experience) {
    throw new Error("Database not connected.");
  }

  await prisma.experience.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/experience");
}
