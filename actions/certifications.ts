"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createCertificationAction(data: {
  title: string;
  issuer: string;
  date: string;
  expirationDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  image?: string;
}) {
  if (!process.env.DATABASE_URL || !prisma?.certification) {
    throw new Error("Database not connected.");
  }

  await prisma.certification.create({
    data: {
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      expirationDate: data.expirationDate || null,
      credentialId: data.credentialId || null,
      credentialUrl: data.credentialUrl || null,
      description: data.description || null,
      image: data.image || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/certifications");
  redirect("/dashboard/certifications");
}

export async function updateCertificationAction(
  id: string,
  data: {
    title: string;
    issuer: string;
    date: string;
    expirationDate?: string | null;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    image?: string;
  }
) {
  if (!process.env.DATABASE_URL || !prisma?.certification) {
    throw new Error("Database not connected.");
  }

  await prisma.certification.update({
    where: { id },
    data: {
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      expirationDate: data.expirationDate || null,
      credentialId: data.credentialId || null,
      credentialUrl: data.credentialUrl || null,
      description: data.description || null,
      image: data.image || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/certifications");
  redirect("/dashboard/certifications");
}

export async function deleteCertificationAction(id: string) {
  if (!process.env.DATABASE_URL || !prisma?.certification) {
    throw new Error("Database not connected.");
  }

  await prisma.certification.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/certifications");
}
