"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import { Certification } from "@/types/certification";
import { certifications as staticCertifications } from "@/data/certifications";

const LOCAL_CERTS_FILE = path.join(process.cwd(), "data", "localCertifications.json");

async function readLocalCertifications(): Promise<Certification[]> {
  try {
    const raw = await fs.readFile(LOCAL_CERTS_FILE, "utf-8");
    return JSON.parse(raw) as Certification[];
  } catch {
    return staticCertifications;
  }
}

async function writeLocalCertifications(certs: Certification[]) {
  try {
    await fs.mkdir(path.dirname(LOCAL_CERTS_FILE), { recursive: true });
    await fs.writeFile(LOCAL_CERTS_FILE, JSON.stringify(certs, null, 2), "utf-8");
  } catch {}
}

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
  if (process.env.DATABASE_URL && prisma?.certification) {
    try {
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
      return;
    } catch (error) {
      console.error("createCertificationAction DB error:", error);
    }
  }

  const local = await readLocalCertifications();
  const newCert: Certification = {
    id: String(Date.now()),
    title: data.title,
    issuer: data.issuer,
    date: data.date,
    expirationDate: data.expirationDate || undefined,
    credentialId: data.credentialId || undefined,
    credentialUrl: data.credentialUrl || undefined,
    description: data.description || undefined,
    image: data.image || undefined,
  };
  local.unshift(newCert);
  await writeLocalCertifications(local);

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
  if (process.env.DATABASE_URL && prisma?.certification) {
    try {
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
      return;
    } catch (error) {
      console.error("updateCertificationAction DB error:", error);
    }
  }

  const local = await readLocalCertifications();
  const idx = local.findIndex((c) => c.id === id);
  if (idx !== -1) {
    local[idx] = {
      ...local[idx],
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      expirationDate: data.expirationDate || undefined,
      credentialId: data.credentialId || undefined,
      credentialUrl: data.credentialUrl || undefined,
      description: data.description || undefined,
      image: data.image || undefined,
    };
    await writeLocalCertifications(local);
  }

  revalidatePath("/");
  revalidatePath("/dashboard/certifications");
  redirect("/dashboard/certifications");
}

export async function deleteCertificationAction(id: string) {
  if (process.env.DATABASE_URL && prisma?.certification) {
    try {
      await prisma.certification.delete({
        where: { id },
      });
    } catch (error) {
      console.warn("deleteCertificationAction DB error:", error);
    }
  }

  const local = await readLocalCertifications();
  const next = local.filter((c) => c.id !== id);
  await writeLocalCertifications(next);

  revalidatePath("/");
  revalidatePath("/dashboard/certifications");
  return { success: true };
}

