"use client";

import React from "react";
import { ExternalLink, Award, ShieldCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types/certification";

interface CertificationCardProps {
  certification: Certification;
  onClick?: () => void;
  className?: string;
}

export default function CertificationCard({
  certification,
  onClick,
  className,
}: CertificationCardProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 cursor-pointer",
        "hover:border-[#FF6B2C]/40 hover:bg-zinc-900/70 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF6B2C]/5",
        "transition-all duration-300",
        className
      )}
      aria-label={`${certification.title} by ${certification.issuer}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Top Row: Icon + Certified Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C] shrink-0 group-hover:scale-105 transition-transform">
          <Award className="w-5 h-5" aria-hidden="true" />
        </div>

        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          CERTIFIED
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-[#FF6B2C] transition-colors">
          {certification.title}
        </h3>
        <p className="text-xs font-semibold text-[#FF6B2C]">{certification.issuer}</p>
        <p className="text-xs text-zinc-500">{certification.date}</p>
      </div>

      {/* Footer Row: Details trigger + Verify Link */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs font-medium text-zinc-400">
        <span className="inline-flex items-center gap-1.5 text-[#FF6B2C] font-semibold group-hover:underline">
          <Eye className="w-3.5 h-3.5" />
          View details
        </span>

        {certification.credentialUrl && (
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Verify certificate: ${certification.title}`}
            className="inline-flex items-center gap-1 text-zinc-500 hover:text-[#FF6B2C] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            Verify
          </a>
        )}
      </div>
    </article>
  );
}