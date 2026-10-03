import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Home,
  ChevronRight,
  Calendar,
  Clock,
  Tag,
  User,
} from "lucide-react";
import Container from "@/components/layout/Container";
import PageWrapper from "@/components/layout/PageWrapper";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import LikeButton from "@/components/ui/LikeButton";
import { getPublishedArticles } from "@/lib/db/data-fetchers";
import { getLikeCounts } from "@/lib/db/likes";
import { SITE_CONFIG } from "@/lib/constants";
import {
  buildInsightsPageBreadcrumb,
  buildInsightsCollectionSchema,
} from "@/lib/seo/structured-data";
import { calculateReadingTime, formatArticleDate } from "@/lib/article-utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Insights | Adam Radi",
  description:
    "Technical articles and insights on web development, Next.js, Laravel, and building software in Morocco by Adam Radi.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: `${SITE_CONFIG.url}/insights`,
    siteName: `${SITE_CONFIG.name} Portfolio`,
    title: "Insights | Adam Radi",
    description:
      "Technical articles and insights on web development, Next.js, Laravel, and building software in Morocco by Adam Radi.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Adam Radi Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Adam Radi",
    description:
      "Technical articles and insights on web development, Next.js, Laravel, and building software in Morocco by Adam Radi.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function InsightsPage() {
  const articles = await getPublishedArticles();
  const likeCounts = await getLikeCounts(
    "ARTICLE",
    articles.map((article) => article.id)
  );

  return (
    <PageWrapper>
      {/* Structured Data for SEO */}
      <JsonLd data={buildInsightsPageBreadcrumb()} />
      <JsonLd data={buildInsightsCollectionSchema(articles)} />

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

            <nav className="flex items-center gap-2 sm:gap-4" aria-label="Quick links">
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
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[#FF6B2C] font-semibold" aria-current="page">
                Insights
              </span>
            </nav>

            {/* Page Header */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6B2C]/30 bg-[#FF6B2C]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FF6B2C]">
                <BookOpen className="h-3 w-3" />
                <span>Technical Writing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Insights <span className="text-zinc-500 font-normal">&</span> Articles
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                Thoughts on web development, full-stack architecture, and building digital products
                in Morocco. Covering Next.js, Laravel, TypeScript, and more.
              </p>
            </div>

            {/* Articles Grid */}
            {articles.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-sm">No articles published yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6B2C]/50 hover:bg-zinc-900/70 hover:shadow-[0_0_0_1px_rgba(255,107,44,0.08),0_24px_80px_rgba(255,107,44,0.08)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,44,0.12),_transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Cover Image */}
                    <Link
                      href={`/insights/${article.slug}`}
                      className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                      tabIndex={-1}
                    >
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-800">
                        {article.coverImage ? (
                          <Image
                            src={article.coverImage}
                            alt={`Cover image for ${article.title}`}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF6B2C]/20 via-zinc-800 to-[#FF7A3D]/20">
                            <BookOpen className="w-10 h-10 text-zinc-600" aria-hidden="true" />
                          </div>
                        )}
                        {/* Category badge */}
                        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-[#FF6B2C]/30 bg-[#FF6B2C]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C] backdrop-blur-sm">
                          <Tag className="w-2.5 h-2.5" />
                          {article.category}
                        </span>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
                      <Link
                        href={`/insights/${article.slug}`}
                        className="group/title inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                      >
                        <h2 className="text-base font-bold leading-snug text-white transition-colors group-hover/title:text-[#FF6B2C] line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.authorName}
                        </span>
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatArticleDate(article.publishedAt)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {calculateReadingTime(article.content)}
                        </span>
                        <LikeButton
                          entityType="ARTICLE"
                          entityId={article.id}
                          count={likeCounts[article.id] ?? 0}
                          entityLabel={article.title}
                          size="sm"
                          className="ml-auto"
                        />
                      </div>

                      <Link
                        href={`/insights/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B2C] hover:text-[#FF7A3D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] rounded"
                        aria-label={`Read ${article.title}`}
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </PageWrapper>
  );
}
