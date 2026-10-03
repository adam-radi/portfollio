"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";
import { Review, ReviewStatus } from "@/types/review";
import { setReviewStatusAction, deleteReviewAction } from "@/actions/reviews";

interface ReviewModerationActionsProps {
  review: Review;
}

export function ReviewModerationActions({ review }: ReviewModerationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatus = async (status: ReviewStatus) => {
    setLoading(true);
    try {
      const res = await setReviewStatusAction(review.id, status);
      if (!res.success) alert(res.error || "Failed to update review.");
      router.refresh();
    } catch {
      alert("Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review? This cannot be undone."))
      return;
    setLoading(true);
    try {
      const res = await deleteReviewAction(review.id);
      if (!res.success) {
        alert(res.error || "Failed to delete review.");
        setLoading(false);
        return;
      }
      router.push("/dashboard/reviews");
      router.refresh();
    } catch {
      alert("Failed to delete review.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {review.status !== "APPROVED" && (
        <button
          type="button"
          onClick={() => handleStatus("APPROVED")}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          <span>Approve</span>
        </button>
      )}

      {review.status !== "REJECTED" && (
        <button
          type="button"
          onClick={() => handleStatus("REJECTED")}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#FF6B2C] bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 hover:bg-[#FF6B2C]/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          <span>Reject</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
}

export default ReviewModerationActions;
