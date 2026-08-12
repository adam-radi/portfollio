import React from "react";
import { notFound } from "next/navigation";
import CertificationForm from "@/components/forms/CertificationForm";
import { prisma } from "@/lib/prisma";
import { certifications as staticCerts } from "@/data/certifications";

interface EditCertificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCertificationPage({ params }: EditCertificationPageProps) {
  const { id } = await params;
  let certification = null;

  try {
    if (process.env.DATABASE_URL && prisma?.certification) {
      const dbCert = await prisma.certification.findUnique({ where: { id } });
      if (dbCert) {
        certification = {
          ...dbCert,
          credentialUrl: dbCert.credentialUrl || undefined,
          expirationDate: dbCert.expirationDate || undefined,
          credentialId: dbCert.credentialId || undefined,
          description: dbCert.description || undefined,
          image: dbCert.image || undefined,
        };
      }
    }
  } catch {
    // Fallback
  }

  if (!certification) {
    const staticC = staticCerts.find((c) => c.id === id);
    if (staticC) certification = staticC;
  }

  if (!certification) notFound();

  return <CertificationForm mode="edit" initialData={certification} />;
}
