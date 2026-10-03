"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { ArticleStatus } from "@/types/article";

type ArticlePayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  publishedAt?: string | null;
  authorName: string;
};

function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function articleData(data: ArticlePayload) {
  const slug = normalizeSlug(data.slug) || normalizeSlug(data.title);

  return {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage || null,
    category: data.category,
    tags: data.tags,
    status: data.status,
    publishedAt:
      data.status === "PUBLISHED"
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : null,
    authorName: data.authorName || "Adam Radi",
  };
}

function revalidateArticleRoutes(slug?: string) {
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/dashboard/articles");
  revalidatePath("/sitemap.xml");
}

export async function createArticleAction(data: ArticlePayload) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.article) {
    throw new Error(
      "Database is not configured. Please set the DATABASE_URL environment variable."
    );
  }

  try {
    const created = await prisma.article.create({ data: articleData(data) });
    revalidateArticleRoutes(created.slug);
  } catch (error) {
    console.error("createArticleAction error:", error);
    throw new Error("Failed to create article. Please try again.");
  }
}

export async function updateArticleAction(id: string, data: ArticlePayload) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.article) {
    throw new Error("Database is not configured.");
  }

  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) throw new Error("Article not found.");

    const next = articleData(data);
    await prisma.article.update({ where: { id }, data: next });

    revalidateArticleRoutes(next.slug);
    if (existing.slug !== next.slug) {
      revalidatePath(`/insights/${existing.slug}`);
    }
  } catch (error) {
    console.error("updateArticleAction error:", error);
    throw error instanceof Error ? error : new Error("Failed to update article.");
  }
}

export async function deleteArticleAction(id: string) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.article) {
    throw new Error("Database is not configured.");
  }

  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) throw new Error("Article not found.");
    await prisma.article.delete({ where: { id } });
    revalidateArticleRoutes(existing.slug);
  } catch (error) {
    console.error("deleteArticleAction error:", error);
    throw error instanceof Error ? error : new Error("Failed to delete article.");
  }
}

export async function toggleArticleStatusAction(id: string, status: ArticleStatus) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.article) {
    throw new Error("Database is not configured.");
  }

  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Article not found." };

    await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? new Date() : null,
      },
    });
    revalidateArticleRoutes(existing.slug);
    return { success: true };
  } catch (error) {
    console.error("toggleArticleStatusAction error:", error);
    return { success: false, error: "Failed to update status." };
  }
}
