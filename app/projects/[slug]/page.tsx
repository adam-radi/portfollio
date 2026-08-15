import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Rocket,
  MessageSquare,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import Container from "@/components/layout/Container";
import { projects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Ticket 10: Dynamic Metadata Generation
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Adam Radi",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.title} | Adam Radi Portfolio`,
    description: project.description,
  };
}

// Generate static params for Next.js build optimization
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  // Ticket 9: Project Not Found Handling
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-28 pb-20 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF6B2C]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#FF7A3D]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Back Button */}
          <div>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] rounded-lg px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/80"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Link>
          </div>

          {/* Title & Intro */}
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6B2C]/30 bg-[#FF6B2C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">
                <Rocket className="h-3 w-3" aria-hidden="true" />
                Case Study
              </span>
              {project.featured && (
                <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed max-w-3xl">
              {project.description}
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 pt-2" aria-label="Technologies used">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-[#FF6B2C]/40 hover:text-[#FF6B2C] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </header>

          {/* Hero Screenshot */}
          <div className="relative aspect-video w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-2xl ring-1 ring-[#FF6B2C]/10">
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} main screenshot`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF6B2C]/10 via-zinc-800 to-[#FF8C4D]/10">
                <span className="text-6xl opacity-35" aria-hidden="true">🖥️</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(9,9,11,0.55)_100%)]" />
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Main content - 8 cols */}
            <div className="md:col-span-8 space-y-10">

              {/* Overview */}
              <section className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">01 · Context</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
                <p className="text-zinc-400 leading-relaxed text-base sm:text-lg">
                  {project.overview}
                </p>
              </section>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <section className="space-y-3 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 shadow-lg shadow-transparent hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">The Problem</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {project.problem}
                  </p>
                </section>

                <section className="space-y-3 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 shadow-lg shadow-transparent hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-shadow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">The Solution</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {project.solution}
                  </p>
                </section>
              </div>

              {/* Features */}
              <section className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">02 · Highlights</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Key Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Key features list">
                  {project.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 transition-colors hover:border-[#FF6B2C]/30 hover:bg-zinc-900/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B2C] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Challenges & Lessons */}
              <div className="space-y-8 pt-2">
                <section className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">03 · Insights</span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Challenges Faced</h2>
                  <div className="space-y-3">
                    {project.challenges.map((challenge, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-sm text-zinc-400"
                      >
                        <span className="font-bold text-[#FF6B2C] text-xs mt-0.5 shrink-0 select-none tabular-nums">
                          0{i + 1}
                        </span>
                        <p className="leading-relaxed">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    Lessons Learned
                  </h2>
                  <div className="space-y-3">
                    {project.lessonsLearned.map((lesson, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-sm text-zinc-400"
                      >
                        <span className="font-bold text-[#FF6B2C] text-xs mt-0.5 shrink-0 select-none tabular-nums">
                          0{i + 1}
                        </span>
                        <p className="leading-relaxed">{lesson}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

            </div>

            {/* Sidebar / CTA Info - 4 cols */}
            <div className="md:col-span-4 space-y-6 md:sticky md:top-28">

              {/* Project links and metadata box */}
              <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Project Type</span>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-200">
                    {project.featured ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2C]" aria-hidden="true" />
                        Featured Case Study
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" aria-hidden="true" />
                        Side Project
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Links</span>
                  <div className="space-y-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                      >
                        <GithubIcon className="w-4 h-4" />
                        Source Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-[#FF6B2C] hover:bg-[#FF7A3D] text-zinc-950 shadow-lg shadow-[#FF6B2C]/20 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {!project.githubUrl && !project.liveUrl && (
                      <p className="text-xs text-zinc-500 italic">
                        Links are unavailable for this project.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 8).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-zinc-800/60 border border-zinc-800 text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <Link
                    href="/#contact"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold rounded-xl border border-[#FF6B2C]/40 bg-[#FF6B2C]/10 hover:bg-[#FF6B2C]/20 text-[#FF6B2C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Work With Me
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Next Project */}
          {(() => {
            const currentIndex = projects.findIndex((p) => p.slug === project.slug);
            const nextProject = projects[(currentIndex + 1) % projects.length];
            if (!nextProject || nextProject.slug === project.slug) return null;
            return (
              <div className="pt-4">
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 transition-all duration-300 hover:border-[#FF6B2C]/50 hover:bg-zinc-900/70 hover:shadow-[0_24px_80px_rgba(255,107,44,0.08)]"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,44,0.12),_transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="relative">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      Next Project
                    </span>
                    <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF6B2C] transition-colors">
                      {nextProject.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400 line-clamp-1 max-w-xl">
                      {nextProject.description}
                    </p>
                  </div>
                  <span className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FF6B2C] px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-[#FF6B2C]/20 transition-transform group-hover:translate-x-1">
                    View Project
                    <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            );
          })()}
        </div>
      </Container>
    </div>
  );
}
