"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/experience";

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const reducedCardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceCard({ experience, className }: ExperienceCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedCardVariants : cardVariants;

  const startFormatted = formatDate(experience.startDate);
  const endFormatted = formatDate(experience.endDate);

  return (
    <motion.article
      variants={variants}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6B2C]/40 hover:bg-zinc-900/70 hover:shadow-[0_0_0_1px_rgba(255,107,44,0.08),0_16px_48px_rgba(255,107,44,0.08)]",
        className
      )}
      aria-label={`${experience.role} at ${experience.company}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#FF6B2C] via-[#FF7A3D] to-transparent opacity-80" />

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold leading-tight text-white">{experience.role}</h3>
          <p className="mt-0.5 text-sm font-semibold text-[#FF6B2C]">{experience.company}</p>
        </div>
        {experience.current && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Current
          </span>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#FF6B2C]" aria-hidden="true" />
          {startFormatted} — {endFormatted}
        </span>
        {experience.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#FF6B2C]" aria-hidden="true" />
            {experience.location}
          </span>
        )}
      </div>

      <ul className="mb-5 space-y-2" aria-label="Responsibilities">
        {experience.description.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B2C]/80" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      {experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Technologies used">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-[#FF6B2C]/30 hover:text-[#FF6B2C]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}
