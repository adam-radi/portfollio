import React from "react";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/forms/ArticleForm";
import { getArticleById } from "@/lib/db/data-fetchers";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return <ArticleForm mode="edit" initialData={article} />;
}
