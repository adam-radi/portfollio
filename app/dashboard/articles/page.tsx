import React from "react";
import ArticleTable from "@/components/dashboard/ArticleTable";
import { getAllArticles } from "@/lib/db/data-fetchers";

export default async function DashboardArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B2C]">
          Content Management
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Articles ({articles.length})
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Write, edit, and publish insights. Only published articles appear on
          /insights and in the sitemap.
        </p>
      </div>

      <ArticleTable initialArticles={articles} />
    </div>
  );
}
