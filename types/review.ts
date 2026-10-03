export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  status: ReviewStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export type PublicReview = Pick<
  Review,
  "name" | "role" | "company" | "content" | "rating" | "linkedinUrl" | "websiteUrl"
>;
