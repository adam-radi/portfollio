export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

// ── Acquisition source ("How did you find me?") ──────────────────────────────
// Single source of truth for the enum, the public form options, the dashboard
// labels and the statistics breakdown. To add a source later (WhatsApp,
// Google Maps, job platform, ...) add it to the Prisma `ReviewSource` enum and
// to the three lists below — nothing else in the Review architecture changes.

export type ReviewSource =
  | "GOOGLE_SEARCH"
  | "LINKEDIN"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "GITHUB"
  | "YOUTUBE"
  | "TIKTOK"
  | "REFERRAL"
  | "OTHER";

export const REVIEW_SOURCES: readonly ReviewSource[] = [
  "GOOGLE_SEARCH",
  "LINKEDIN",
  "INSTAGRAM",
  "FACEBOOK",
  "GITHUB",
  "YOUTUBE",
  "TIKTOK",
  "REFERRAL",
  "OTHER",
];

/** Dashboard / analytics labels (human-readable, admin-facing). */
export const REVIEW_SOURCE_LABELS: Record<ReviewSource, string> = {
  GOOGLE_SEARCH: "Google Search",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  GITHUB: "GitHub",
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  REFERRAL: "Referral",
  OTHER: "Other",
};

/** Public form options — visitors never see the internal enum names. */
export const REVIEW_SOURCE_OPTIONS: readonly {
  value: ReviewSource;
  label: string;
}[] = [
  { value: "GOOGLE_SEARCH", label: "Google Search" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "GITHUB", label: "GitHub" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "REFERRAL", label: "Someone recommended me" },
  { value: "OTHER", label: "Other" },
];

/** Shown for rows stored before the source field existed (never guessed). */
export const REVIEW_SOURCE_UNKNOWN_LABEL = "Not specified";

export function isReviewSource(value: unknown): value is ReviewSource {
  return (
    typeof value === "string" &&
    (REVIEW_SOURCES as readonly string[]).includes(value)
  );
}

export interface Review {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  source: ReviewSource | null;
  status: ReviewStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export type PublicReview = Pick<
  Review,
  "name" | "role" | "company" | "content" | "rating" | "linkedinUrl" | "websiteUrl"
>;
