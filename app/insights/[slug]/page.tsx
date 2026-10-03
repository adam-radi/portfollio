import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  Clock,
  Tag,
  User,
  Home,
  ChevronRight,
  BookOpen,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import Container from "@/components/layout/Container";
import PageWrapper from "@/components/layout/PageWrapper";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import LikeButton from "@/components/ui/LikeButton";
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/lib/db/data-fetchers";
import { getLikeCounts } from "@/lib/db/likes";
import { SITE_CONFIG } from "@/lib/constants";
import {
  buildArticleSchema,
  buildArticleBreadcrumb,
} from "@/lib/seo/structured-data";
import {
  calculateReadingTime,
  formatArticleDate,
  renderMarkdown,
} from "@/lib/article-utils";

export const revalidate = 3600;
export const dynamicParams = true;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_CONFIG.url}/insights/${article.slug}`;
  const ogImage = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : `${SITE_CONFIG.url}${article.coverImage}`
    : `${SITE_CONFIG.url}/logo.png`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      type: "article",
      locale: SITE_CONFIG.locale,
      url,
      siteName: `${SITE_CONFIG.name} Portfolio`,
      title: `${article.title} — Adam Radi`,
      description: article.excerpt,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.authorName],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} by Adam Radi`,
      description: article.excerpt,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // getArticleBySlug returns null for DRAFTs → 404 for the public.
  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    article.id,
    article.category,
    article.tags
  );

  const likeCounts = await getLikeCounts("ARTICLE", [article.id]);

  const readingTime = calculateReadingTime(article.content);
  const contentHtml = renderMarkdown(article.content);
  const showUpdated =
    article.publishedAt !== null &&
    article.updatedAt.getTime() - article.publishedAt.getTime() > 86400000;

  return (
    <PageWrapper>
      <JsonLd data={buildArticleSchema(article)} />
      <JsonLd data={buildArticleBreadcrumb(article.title, article.slug)} />

      {/* Fixed Navigation — same as /insights */}
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
                href="/insights"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all border border-transparent hover:border-zinc-700"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Insights</span>
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

      <main className="pt-28 pb-20 flex-1">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400"
            >
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <Link href="/insights" className="hover:text-white transition-colors">
                Insights
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span
                className="text-[#FF6B2C] font-semibold truncate max-w-[200px]"
                aria-current="page"
              >
                {article.title}
              </span>
            </nav>

            {/* Article Header */}
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6B2C]/30 bg-[#FF6B2C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {article.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {article.title}
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author + Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400 pt-2 border-t border-zinc-800/60">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <User className="w-4 h-4 text-[#FF6B2C]" aria-hidden="true" />
                  {article.authorName}
                </span>
                {article.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time dateTime={article.publishedAt.toISOString()}>
                      {formatArticleDate(article.publishedAt)}
                    </time>
                  </span>
                )}
                {showUpdated && (
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <RefreshCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Updated {formatArticleDate(article.updatedAt)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {readingTime}
                </span>
                <LikeButton
                  entityType="ARTICLE"
                  entityId={article.id}
                  count={likeCounts[article.id] ?? 0}
                  entityLabel={article.title}
                  size="md"
                  showLabel
                  className="ml-auto"
                />
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5" aria-label="Article tags">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-zinc-800/80 border border-zinc-700/50 text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="relative aspect-video w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-2xl ring-1 ring-[#FF6B2C]/10">
                <Image
                  src={article.coverImage}
                  alt={`Cover image for ${article.title}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(9,9,11,0.45)_100%)]"
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Internal Linking / CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60">
              <Link
                href="/projects"
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-[#FF6B2C]/40 hover:bg-zinc-900/70 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#FF6B2C]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#FF6B2C] transition-colors">
                    Browse Projects
                  </p>
                  <p className="text-[11px] text-zinc-500">See my portfolio work</p>
                </div>
              </Link>

              <Link
                href="/#about"
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-[#FF6B2C]/40 hover:bg-zinc-900/70 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#FF6B2C]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#FF6B2C] transition-colors">
                    About Me
                  </p>
                  <p className="text-[11px] text-zinc-500">Who is Adam Radi</p>
                </div>
              </Link>

              <Link
                href="/#contact"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#FF6B2C]/30 bg-[#FF6B2C]/10 hover:bg-[#FF6B2C]/20 transition-all group sm:col-span-2 lg:col-span-1"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#FF6B2C]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FF6B2C]">Work With Me</p>
                  <p className="text-[11px] text-zinc-500">
                    Me contacter pour un projet
                  </p>
                </div>
              </Link>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="space-y-6 pt-4" aria-labelledby="related-heading">
                <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-4">
                  <h2 id="related-heading" className="text-lg font-bold text-white">
                    Related Articles
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedArticles.map((related) => (
                    <article
                      key={related.id}
                      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-[#FF6B2C]/40 transition-all hover:-translate-y-0.5"
                    >
                      <Link href={`/insights/${related.slug}`} tabIndex={-1}>
                        <div className="relative h-36 w-full overflow-hidden bg-zinc-800">
                          {related.coverImage ? (
                            <Image
                              src={related.coverImage}
                              alt={related.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF6B2C]/15 via-zinc-800 to-zinc-900">
                              <BookOpen className="w-8 h-8 text-zinc-600" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-col gap-2 p-4 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                          {related.category}
                        </span>
                        <Link href={`/insights/${related.slug}`}>
                          <h3 className="text-sm font-bold text-white group-hover:text-[#FF6B2C] transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                        </Link>
                        <div className="mt-auto flex items-center gap-2 text-[11px] text-zinc-500 pt-2">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {calculateReadingTime(related.content)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </PageWrapper>
  );
}
