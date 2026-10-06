import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Calendar, Globe, User, Building2, Search } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/icons";
import { getReviewById } from "@/lib/db/data-fetchers";
import ReviewModerationActions from "@/components/dashboard/ReviewModerationActions";
import {
  REVIEW_SOURCE_LABELS,
  REVIEW_SOURCE_UNKNOWN_LABEL,
} from "@/types/review";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES = {
  PENDING: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
} as const;

const STATUS_LABELS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) notFound();

  return (
    <div className="max-w-3xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link
            href="/dashboard/reviews"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Reviews
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Review Details
          </h1>
        </div>

        <ReviewModerationActions review={review} />
      </div>

      {/* Review Card */}
      <div className="p-8 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">{review.name}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  STATUS_STYLES[review.status]
                }`}
              >
                {STATUS_LABELS[review.status]}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              {review.role && (
                <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                  <User className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  {review.role}
                </span>
              )}
              {review.company && (
                <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  {review.company}
                </span>
              )}
              <span
                title="How did you find me?"
                className="flex items-center gap-1.5 text-zinc-200 font-semibold"
              >
                <Search className="w-3.5 h-3.5 text-[#FF6B2C]" />
                {review.source
                  ? REVIEW_SOURCE_LABELS[review.source]
                  : REVIEW_SOURCE_UNKNOWN_LABEL}
                <span className="text-zinc-500 font-normal">
                  · how they found you
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-4 h-4 ${
                    n <= review.rating
                      ? "fill-[#FF6B2C] text-[#FF6B2C]"
                      : "text-zinc-700"
                  }`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 text-xs text-zinc-500">{review.rating}/5</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Review Content
          </h3>
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
            {review.content}
          </div>
        </div>

        {/* Optional Links */}
        {(review.linkedinUrl || review.websiteUrl) && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Links
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {review.linkedinUrl && (
                <a
                  href={review.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  LinkedIn Profile
                </a>
              )}
              {review.websiteUrl && (
                <a
                  href={review.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
