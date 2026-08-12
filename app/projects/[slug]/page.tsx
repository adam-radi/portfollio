import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
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
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Back Button */}
          <div>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/80"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Link>
          </div>

          {/* Title & Intro */}
          <header className="space-y-4">
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
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </header>

          {/* Hero Screenshot */}
          <div className="relative aspect-video w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-2xl">
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
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/10 via-zinc-800 to-indigo-600/10">
                <span className="text-6xl opacity-35" aria-hidden="true">🖥️</span>
              </div>
            )}
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Main content - 8 cols */}
            <div className="md:col-span-8 space-y-10">
              
              {/* Overview */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>
                <p className="text-zinc-400 leading-relaxed text-base sm:text-lg">
                  {project.overview}
                </p>
              </section>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <section className="space-y-3 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
                  <h3 className="text-base font-bold text-red-400 tracking-tight flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> The Problem
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {project.problem}
                  </p>
                </section>

                <section className="space-y-3 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
                  <h3 className="text-base font-bold text-emerald-400 tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> The Solution
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {project.solution}
                  </p>
                </section>
              </div>

              {/* Features */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Key Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Key features list">
                  {project.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Challenges & Lessons */}
              <div className="space-y-8 pt-2">
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Challenges Faced</h2>
                  <div className="space-y-3">
                    {project.challenges.map((challenge, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-sm text-zinc-400"
                      >
                        <span className="font-semibold text-zinc-500 shrink-0 select-none">0{i + 1}.</span>
                        <p className="leading-relaxed">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    Lessons Learned
                  </h2>
                  <div className="space-y-3">
                    {project.lessonsLearned.map((lesson, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-sm text-zinc-400"
                      >
                        <span className="font-semibold text-zinc-500 shrink-0 select-none">0{i + 1}.</span>
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
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Project Type</span>
                  <p className="text-sm font-semibold text-zinc-200">
                    {project.featured ? "Featured Case Study" : "Side Project"}
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
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
              </div>

            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
