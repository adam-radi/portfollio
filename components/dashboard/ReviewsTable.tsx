"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Review,
  ReviewStatus,
  REVIEW_SOURCE_LABELS,
  REVIEW_SOURCE_UNKNOWN_LABEL,
} from "@/types/review";
import { setReviewStatusAction, deleteReviewAction } from "@/actions/reviews";

interface ReviewsTableProps {
  initialReviews: Review[];
}

const FILTERS: { id: ReviewStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES: Record<ReviewStatus, string> = {
  PENDING: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function ReviewsTable({ initialReviews }: ReviewsTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<ReviewStatus | "ALL">("ALL");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const counts = initialReviews.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, APPROVED: 0, REJECTED: 0 } as Record<ReviewStatus, number>
  );

  const filtered =
    filter === "ALL"
      ? initialReviews
      : initialReviews.filter((r) => r.status === filter);

  const handleStatus = async (id: string, status: ReviewStatus) => {
    setPendingId(id);
    try {
      const res = await setReviewStatusAction(id, status);
      if (!res.success) alert(res.error || "Failed to update review.");
      router.refresh();
    } catch {
      alert("Failed to update review.");
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review? This cannot be undone."))
      return;
    setPendingId(id);
    try {
      const res = await deleteReviewAction(id);
      if (!res.success) alert(res.error || "Failed to delete review.");
      router.refresh();
    } catch {
      alert("Failed to delete review.");
    } finally {
      setPendingId(null);
    }
  };

  if (initialReviews.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800/80 bg-[#111319] p-6">
        <div className="py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-[#FF6B2C]">
            <MessageSquare className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-white">No Reviews Yet</p>
          <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500">
            Reviews submitted through the public portfolio form will appear here for
            moderation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === "ALL" ? initialReviews.length : counts[f.id as ReviewStatus] || 0;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                active
                  ? "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/30"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
              }`}
              aria-pressed={active}
            >
              {f.label}
              <span className={`ml-1.5 ${active ? "text-[#FF6B2C]" : "text-zinc-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500 italic">
            No reviews with this status.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => (
              <article
                key={review.id}
                className="space-y-3 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {review.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          STATUS_STYLES[review.status]
                        }`}
                      >
                        {STATUS_LABELS[review.status]}
                      </span>
                      <span
                        title="How they found you"
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-zinc-900/80 border-zinc-700/60 ${
                          review.source ? "text-zinc-300" : "text-zinc-500 italic"
                        }`}
                      >
                        {review.source
                          ? REVIEW_SOURCE_LABELS[review.source]
                          : REVIEW_SOURCE_UNKNOWN_LABEL}
                      </span>
                    </div>

                    {(review.role || review.company) && (
                      <p className="text-xs text-zinc-400">
                        {[review.role, review.company].filter(Boolean).join(" · ")}
                      </p>
                    )}

                    <div className="flex items-center gap-1 pt-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3.5 h-3.5 ${
                            n <= review.rating
                              ? "fill-[#FF6B2C] text-[#FF6B2C]"
                              : "text-zinc-700"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="ml-1.5 text-[10px] text-zinc-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 text-[10px] text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="line-clamp-3 text-xs leading-relaxed text-zinc-400">
                  {review.content}
                </p>

                <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/50 pt-3">
                  <Link
                    href={`/dashboard/reviews/${review.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Link>

                  {review.status !== "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(review.id, "APPROVED")}
                      disabled={pendingId === review.id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {review.status !== "REJECTED" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(review.id, "REJECTED")}
                      disabled={pendingId === review.id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#FF6B2C] transition-colors hover:bg-[#FF6B2C]/10 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    disabled={pendingId === review.id}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsTable;
