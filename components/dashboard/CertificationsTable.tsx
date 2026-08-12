"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Award, ExternalLink } from "lucide-react";
import { Certification } from "@/types/certification";
import { deleteCertificationAction } from "@/actions/certifications";

interface CertificationsTableProps {
  initialCertifications: Certification[];
}

export default function CertificationsTable({ initialCertifications }: CertificationsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      setDeletingId(id);
      try {
        await deleteCertificationAction(id);
      } catch {
        alert("Failed to delete certification.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-4">
      {initialCertifications.length === 0 ? (
        <p className="text-xs text-zinc-500 italic text-center py-8">No certifications added yet.</p>
      ) : (
        <div className="space-y-3">
          {initialCertifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 text-[#FF6B2C] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{cert.title}</h3>
                  <p className="text-xs text-zinc-400">
                    <span className="text-[#FF6B2C] font-semibold">{cert.issuer}</span> • {cert.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Verify Credential"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <Link
                  href={`/dashboard/certifications/${cert.id}/edit`}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Edit Certification"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(cert.id)}
                  disabled={deletingId === cert.id}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors"
                  title="Delete Certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
