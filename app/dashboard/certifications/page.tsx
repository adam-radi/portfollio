import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCertifications } from "@/lib/db/data-fetchers";
import CertificationsTable from "@/components/dashboard/CertificationsTable";

export default async function DashboardCertificationsPage() {
  const certs = await getCertifications();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B2C]">
            Credentials Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Certifications ({certs.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your verified certifications, issuers, and dates.
          </p>
        </div>

        <Link
          href="/dashboard/certifications/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Certification</span>
        </Link>
      </div>

      <CertificationsTable initialCertifications={certs} />
    </div>
  );
}
