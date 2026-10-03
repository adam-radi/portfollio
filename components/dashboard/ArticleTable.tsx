"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Edit, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Article } from "@/types/article";
import {
  deleteArticleAction,
  toggleArticleStatusAction,
} from "@/actions/articles";
import { formatArticleDate } from "@/lib/article-utils";

interface ArticleTableProps {
  initialArticles: Article[];
}

export function ArticleTable({ initialArticles }: ArticleTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredArticles = initialArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article? This cannot be undone.")) {
      setDeletingId(id);
      try {
        await deleteArticleAction(id);
      } catch {
        alert("Failed to delete article.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleStatus = async (article: Article) => {
    try {
      const next = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      await toggleArticleStatusAction(article.id, next);
    } catch {
      alert("Failed to update article status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111319] border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>

        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Articles List Container */}
      <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500 italic">
            No articles match your search criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => {
              const isPublished = article.status === "PUBLISHED";
              return (
                <div
                  key={article.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition-all gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {article.title}
                      </h3>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                          isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-900 text-zinc-500 border-zinc-800"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(article)}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 transition-colors"
                        title={isPublished ? "Unpublish (set as Draft)" : "Publish article"}
                      >
                        {isPublished ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        <span>{isPublished ? "Unpublish" : "Publish"}</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1">{article.excerpt}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-zinc-500">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                        {article.category}
                      </span>
                      {article.publishedAt && (
                        <span>{formatArticleDate(article.publishedAt)}</span>
                      )}
                      <span className="text-zinc-600">by {article.authorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/insights/${article.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title={
                        isPublished ? "View Public Page" : "Draft — not publicly visible"
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/dashboard/articles/${article.id}/edit`}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Article"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-colors disabled:opacity-50"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleTable;
