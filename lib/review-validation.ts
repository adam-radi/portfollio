// Shared review validation — used by the public form (client) and the
// /api/reviews route (server) so both sides enforce the exact same rules.

import { isReviewSource, ReviewSource } from "@/types/review";

export const REVIEW_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  roleMax: 100,
  companyMax: 100,
  contentMin: 10,
  contentMax: 1000,
  urlMax: 500,
} as const;

export interface ReviewInput {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  linkedinUrl?: string;
  websiteUrl?: string;
  source?: string;
  honeypot?: string;
}

export interface NormalizedReview {
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  source: ReviewSource;
}

export type ReviewErrors = Partial<Record<"name" | "role" | "company" | "content" | "rating" | "linkedinUrl" | "websiteUrl" | "source", string>>;

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (!url.hostname.includes(".")) return false;
    if (url.username || url.password) return false;
    return true;
  } catch {
    return false;
  }
}

type ReviewValidationResult =
  | { ok: true; data: NormalizedReview }
  | { ok: false; errors: ReviewErrors };

export function validateReview(raw: ReviewInput): ReviewValidationResult {
  const errors: ReviewErrors = {};

  const name = String(raw.name || "").trim();
  const role = String(raw.role || "").trim();
  const company = String(raw.company || "").trim();
  const content = String(raw.content || "").trim();
  const linkedinUrl = String(raw.linkedinUrl || "").trim();
  const websiteUrl = String(raw.websiteUrl || "").trim();
  const source = typeof raw.source === "string" ? raw.source.trim() : "";
  const rating = typeof raw.rating === "string" ? Number(raw.rating) : raw.rating;

  if (name.length < REVIEW_LIMITS.nameMin || name.length > REVIEW_LIMITS.nameMax) {
    errors.name = `Name must be between ${REVIEW_LIMITS.nameMin} and ${REVIEW_LIMITS.nameMax} characters.`;
  }
  if (role.length > REVIEW_LIMITS.roleMax) {
    errors.role = `Role must be at most ${REVIEW_LIMITS.roleMax} characters.`;
  }
  if (company.length > REVIEW_LIMITS.companyMax) {
    errors.company = `Company must be at most ${REVIEW_LIMITS.companyMax} characters.`;
  }
  if (content.length < REVIEW_LIMITS.contentMin || content.length > REVIEW_LIMITS.contentMax) {
    errors.content = `Review must be between ${REVIEW_LIMITS.contentMin} and ${REVIEW_LIMITS.contentMax} characters.`;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be a whole number between 1 and 5.";
  }
  if (linkedinUrl && (linkedinUrl.length > REVIEW_LIMITS.urlMax || !isValidHttpUrl(linkedinUrl))) {
    errors.linkedinUrl = "Please provide a valid LinkedIn URL (https://...).";
  }
  if (websiteUrl && (websiteUrl.length > REVIEW_LIMITS.urlMax || !isValidHttpUrl(websiteUrl))) {
    errors.websiteUrl = "Please provide a valid website URL (https://...).";
  }
  // Acquisition source — only the predefined ReviewSource values are accepted.
  // Anything else (custom text, objects, missing) is rejected server-side.
  const validSource = isReviewSource(source) ? source : null;
  if (!validSource) {
    errors.source = "Please choose how you found this profile.";
  }

  if (Object.keys(errors).length > 0 || !validSource) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      role: role || null,
      company: company || null,
      content,
      rating,
      linkedinUrl: linkedinUrl || null,
      websiteUrl: websiteUrl || null,
      source: validSource,
    },
  };
}
