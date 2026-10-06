import React from "react";
import ReviewsTable from "@/components/dashboard/ReviewsTable";
import ReviewSourceStats from "@/components/dashboard/ReviewSourceStats";
import { getAllReviews, getReviewStats } from "@/lib/db/data-fetchers";

export default async function DashboardReviewsPage() {
  const [reviews, stats] = await Promise.all([
    getAllReviews(),
    getReviewStats(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B2C]">
          Moderation
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Reviews ({reviews.length})
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Guest submissions from the public portfolio. Only approved reviews are shown
          on the homepage.
        </p>
      </div>

      {/* Acquisition-source statistics */}
      <ReviewSourceStats stats={stats} />

      <ReviewsTable initialReviews={reviews} />
    </div>
  );
}
