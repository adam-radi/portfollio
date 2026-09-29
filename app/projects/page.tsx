import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Rocket, Home, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import PageWrapper from "@/components/layout/PageWrapper";
import Footer from "@/components/sections/Footer";
import ProjectsExplorer from "@/components/sections/ProjectsExplorer";
import JsonLd from "@/components/seo/JsonLd";
import { getProjects } from "@/lib/db/data-fetchers";
import { SITE_CONFIG } from "@/lib/constants";
import {
  buildProjectsPageBreadcrumb,
  buildProjectsCollectionSchema,
} from "@/lib/seo/structured-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects | Adam Radi",
  description:
    "Explore web applications and software projects developed by Adam Radi.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: `${SITE_CONFIG.url}/projects`,
    siteName: `${SITE_CONFIG.name} Portfolio`,
    title: "Projects | Adam Radi",
    description:
      "Explore web applications and software projects developed by Adam Radi.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Adam Radi Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Adam Radi",
    description:
      "Explore web applications and software projects developed by Adam Radi.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ProjectsPage() {
  const allProjects = await getProjects();
  const publishedProjects = allProjects.filter((p) => p.published !== false);

  return (
    <PageWrapper>
      {/* Structured Data for SEO */}
      <JsonLd data={buildProjectsPageBreadcrumb()} />
      <JsonLd data={buildProjectsCollectionSchema(publishedProjects)} />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0b0d]/90 backdrop-blur-xl border-b border-zinc-800/80 py-3.5 shadow-2xl">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] rounded-xl"
            >
              <div className="flex items-center justify-center w-8 h-8 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Adam Radi Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: "screen" }}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none text-white tracking-tight group-hover:text-[#FF6B2C] transition-colors">
                  Radi <span className="text-zinc-400 font-normal">&</span> Code
                </span>
                <span className="text-[9px] text-[#FF6B2C] tracking-wider uppercase font-semibold">
                  Developer Portfolio
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4" aria-label="Breadcrumb and quick links">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all border border-transparent hover:border-zinc-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-zinc-950 transition-all shadow-md shadow-[#FF6B2C]/20"
              >
                <span>Contact</span>
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 flex-1">
        <Container>
          <div className="space-y-10">
            {/* Breadcrumb List */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[#FF6B2C] font-semibold" aria-current="page">
                Projects
              </span>
            </nav>

            {/* Page Header */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6B2C]/30 bg-[#FF6B2C]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FF6B2C]">
                <Rocket className="h-3 w-3" />
                <span>Portfolio Archive</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Featured Projects <span className="text-zinc-500 font-normal">&</span> Work
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                Explore web applications, full-stack systems, and digital products developed by Adam Radi.
                Each project showcases modern architecture, clean code, and production-ready implementation.
              </p>
            </div>

            {/* Interactive Projects Explorer */}
            <ProjectsExplorer initialProjects={publishedProjects} />
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </PageWrapper>
  );
}
