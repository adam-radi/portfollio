"use client";

import React from "react";
import { ExternalLink, Award, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types/certification";

interface CertificationCardProps {
  certification: Certification;
  className?: string;
}

export default function CertificationCard({ certification, className }: CertificationCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40",
        "hover:border-[#FF6B2C]/40 hover:bg-zinc-900/70 hover:-translate-y-0.5",
        "transition-all duration-300",
        className
      )}
      aria-label={`${certification.title} by ${certification.issuer}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] shrink-0">
        <Award className="w-5 h-5" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
          {certification.title}
        </h3>
        <p className="text-xs font-medium text-[#FF6B2C]">{certification.issuer}</p>
        <p className="text-xs text-zinc-500">{certification.date}</p>
      </div>

      {/* CERTIFIED Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          CERTIFIED
        </span>
      </div>

      {/* Verify Link */}
      {certification.credentialUrl && (
        <a
          href={certification.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Verify certificate: ${certification.title}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-[#FF6B2C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] rounded"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          Verify certificate
        </a>
      )}
    </article>
  );
}