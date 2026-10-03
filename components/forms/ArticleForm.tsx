"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, FileText } from "lucide-react";
import FormField from "./FormField";
import FormSection from "./FormSection";
import DynamicList from "./DynamicList";
import ImageUpload from "./ImageUpload";
import SubmitButton from "./SubmitButton";
import { createArticleAction, updateArticleAction } from "@/actions/articles";
import { Article, ArticleStatus } from "@/types/article";

interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: Article;
}

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]";

export function ArticleForm({ mode, initialData }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || "",
    status: (initialData?.status || "DRAFT") as ArticleStatus,
    publishedAt: initialData?.publishedAt
      ? initialData.publishedAt.toISOString().slice(0, 10)
      : "",
    authorName: initialData?.authorName || "Adam Radi",
  });

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generatedSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        tags: tags.filter((tag) => tag.trim() !== ""),
        publishedAt: formData.publishedAt || null,
      };

      if (mode === "create") {
        await createArticleAction(payload);
      } else if (initialData?.id) {
        await updateArticleAction(initialData.id, payload);
      }

      router.push("/dashboard/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article.");
      setLoading(false);
    }
  };

  const previewHref =
    mode === "edit" && initialData?.slug ? `/insights/${initialData.slug}` : "/insights";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/articles"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Articles
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {mode === "create" ? "New Article" : `Edit Article: ${initialData?.title}`}
          </h1>
          <p className="text-xs text-zinc-400">
            Markdown-style content is supported: ## H2, ### H3, - lists, 1. lists, **bold**,
            *italic*, `code`, ``` code blocks, [links](url), ![images](url).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={previewHref}
            target={mode === "edit" ? "_blank" : undefined}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Link>
          <Link
            href="/dashboard/articles"
            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>
          <SubmitButton
            type="submit"
            loading={loading}
            label={mode === "create" ? "Create Article" : "Save Changes"}
            className="px-5 py-2.5"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-medium text-rose-400">
          {error}
        </div>
      )}

      <FormSection
        title="Basic Information"
        description="Core public fields used on article cards, metadata and detail pages."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Article Title" htmlFor="article-title" required>
            <input
              id="article-title"
              type="text"
              required
              placeholder="e.g. How to Build a Web App in Morocco"
              value={formData.title}
              onChange={handleTitleChange}
              className={inputClass}
            />
          </FormField>

          <FormField
            label="URL Slug"
            htmlFor="article-slug"
            required
            helperText="Unique URL identifier for /insights/[slug]"
          >
            <input
              id="article-slug"
              type="text"
              required
              placeholder="how-to-build-a-web-app-in-morocco"
              value={formData.slug}
              onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField
          label="Short Excerpt"
          htmlFor="article-excerpt"
          required
          helperText="Shown on article cards and used as meta description"
        >
          <textarea
            id="article-excerpt"
            rows={2}
            required
            placeholder="A concise summary of the article..."
            value={formData.excerpt}
            onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Category" htmlFor="article-category" required>
            <input
              id="article-category"
              type="text"
              required
              placeholder="e.g. Web Development"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              className={inputClass}
            />
          </FormField>

          <FormField label="Author" htmlFor="article-author" required>
            <input
              id="article-author"
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData((p) => ({ ...p, authorName: e.target.value }))}
              className={inputClass}
            />
          </FormField>
        </div>

        <DynamicList
          label="Tags"
          items={tags}
          onChange={setTags}
          placeholder="e.g. Next.js"
        />
      </FormSection>

      <FormSection
        title="Article Content"
        description="Long-form content. Supports H2/H3, paragraphs, lists, links, bold, italic, code blocks and images."
      >
        <FormField
          label="Content (Markdown)"
          htmlFor="article-content"
          required
          helperText="Use ## for sections, ### for subsections, - for bullet lists, 1. for numbered lists, ``` for code blocks."
        >
          <textarea
            id="article-content"
            rows={20}
            required
            placeholder={"## Section title\n\nWrite your paragraph here...\n\n- Bullet point\n\n```js\nconsole.log('hello');\n```"}
            value={formData.content}
            onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Media"
        description="Cover image upload supports preview, replace and remove."
      >
        <ImageUpload
          label="Cover Image"
          helperText="Upload an article cover image or paste a public URL."
          value={formData.coverImage}
          onChange={(value) => setFormData((p) => ({ ...p, coverImage: value }))}
        />
      </FormSection>

      <FormSection
        title="Publishing"
        description="Only PUBLISHED articles are visible on /insights and in the sitemap."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="Status" htmlFor="article-status" required>
            <select
              id="article-status"
              value={formData.status}
              onChange={(e) =>
                setFormData((p) => ({ ...p, status: e.target.value as ArticleStatus }))
              }
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </FormField>

          <FormField
            label="Publication Date"
            htmlFor="article-published-at"
            helperText="Used when status is Published"
          >
            <input
              id="article-published-at"
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData((p) => ({ ...p, publishedAt: e.target.value }))}
              className={inputClass}
            />
          </FormField>

          <div className="flex items-end">
            <div className="flex w-full items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-400">
              <FileText className="h-4 w-4 shrink-0 text-[#FF6B2C]" />
              <span>
                {formData.status === "PUBLISHED"
                  ? "Visible on /insights and sitemap."
                  : "Hidden from the public site."}
              </span>
            </div>
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/dashboard/articles"
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          Cancel
        </Link>
        <SubmitButton
          type="submit"
          loading={loading}
          label={mode === "create" ? "Create Article" : "Save Changes"}
          className="px-6 py-3"
        />
      </div>
    </form>
  );
}

export default ArticleForm;
