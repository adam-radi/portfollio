export type ArticleStatus = "DRAFT" | "PUBLISHED";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  status: ArticleStatus;
  publishedAt: Date | null;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}
