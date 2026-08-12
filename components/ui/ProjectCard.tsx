"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GithubIcon, ExternalLink } from "@/components/ui/icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  className?: string;
}

export default function ProjectCard({ project, featured = false, className }: ProjectCardProps) {
  return (
    <motion.article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6B2C]/50 hover:bg-zinc-900/70 hover:shadow-[0_0_0_1px_rgba(255,107,44,0.08),0_24px_80px_rgba(255,107,44,0.08)]",
        className
      )}
      aria-label={project.title}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,44,0.12),_transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <Link
        href={`/projects/${project.slug}`}
        className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
        aria-label={`View ${project.title} details`}
        tabIndex={-1}
      >
        <div className={cn("relative w-full overflow-hidden bg-zinc-800", featured ? "h-56 sm:h-64" : "h-44 sm:h-52")}>
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF6B2C]/20 via-zinc-800 to-[#FF7A3D]/20">
              <span className="text-4xl opacity-40" aria-hidden="true">
                🖥️
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="relative z-10 flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <Link
            href={`/projects/${project.slug}`}
            className="group/title inline-flex items-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
          >
            <h3 className="text-base font-bold leading-tight text-white transition-colors group-hover/title:text-[#FF6B2C]">
              {project.title}
            </h3>
            <ArrowUpRight
              className="h-4 w-4 text-zinc-500 transition-all duration-200 group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-[#FF6B2C]"
              aria-hidden="true"
            />
          </Link>
          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-zinc-700/50 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300 transition-colors group-hover:border-[#FF6B2C]/30 group-hover:text-[#FF6B2C]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-zinc-400 transition-colors hover:text-[#FF6B2C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
            >
              <GithubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-[#FF6B2C] transition-colors hover:text-[#FF7A3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
