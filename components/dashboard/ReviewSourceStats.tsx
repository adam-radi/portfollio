import React from "react";
import { Search, MessageSquare } from "lucide-react";
import {
  ReviewDashboardStats,
  ReviewSourceStat,
} from "@/lib/db/data-fetchers";
import { REVIEW_SOURCE_UNKNOWN_LABEL } from "@/types/review";

interface ReviewSourceStatsProps {
  stats: ReviewDashboardStats;
}

function StatusChip({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
      <span className="text-xs text-zinc-400">{label}</span>
      <span
        className={`text-sm font-extrabold tabular-nums ${
          accent ? "text-[#FF6B2C]" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SourceRow({ stat }: { stat: ReviewSourceStat }) {
  const hasData = stat.count > 0;
  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span
          className={`font-medium ${hasData ? "text-zinc-200" : "text-zinc-500"}`}
        >
          {stat.label}
        </span>
        <span className="text-zinc-500 tabular-nums shrink-0">
          <span className={hasData ? "text-white font-bold" : "text-zinc-500"}>
            {stat.count}
          </span>
          <span className="mx-1 text-zinc-700">·</span>
          {stat.percentage}%
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-zinc-950/80 border border-zinc-800/60 overflow-hidden"
        role="img"
        aria-label={`${stat.label}: ${stat.count} reviews, ${stat.percentage}%`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D] transition-all"
          style={{ width: `${stat.percentage}%` }}
        />
      </div>
    </li>
  );
}

/**
 * Acquisition-source statistics for /dashboard/reviews.
 *
 * The headline breakdown counts APPROVED reviews only — that is the set the
 * public site actually renders. A second, secondary breakdown reports every
 * submission (approved + pending + rejected).
 */
export default function ReviewSourceStats({ stats }: ReviewSourceStatsProps) {
  const approvedTotal = stats.approved;
  const submittedTotal = stats.total;

  return (
    <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-[#FF6B2C]" />
          How people found Adam Radi
        </h2>
        <span className="text-xs font-semibold text-[#FF6B2C]">
          Based on {approvedTotal} approved review{approvedTotal === 1 ? "" : "s"}
        </span>
      </div>

      {/* Moderation totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusChip label="Total submitted" value={stats.total} accent />
        <StatusChip label="Approved" value={stats.approved} />
        <StatusChip label="Pending" value={stats.pending} />
        <StatusChip label="Rejected" value={stats.rejected} />
      </div>

      {/* Main breakdown — APPROVED reviews (public-facing analysis) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            By source — approved reviews
          </h3>
          <span className="text-[10px] text-zinc-600">
            {approvedTotal} approved
          </span>
        </div>

        {approvedTotal === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            No approved reviews yet — percentages appear once reviews are approved.
          </p>
        ) : (
          <ul className="space-y-3">
            {stats.approvedBySource.map((stat) => (
              <SourceRow key={stat.source} stat={stat} />
            ))}
            {stats.approvedUnspecified > 0 && (
              <li className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-zinc-500 italic">
                    {REVIEW_SOURCE_UNKNOWN_LABEL}
                  </span>
                  <span className="text-zinc-500 tabular-nums shrink-0">
                    <span className="text-white font-bold">
                      {stats.approvedUnspecified}
                    </span>
                    <span className="mx-1 text-zinc-700">·</span>
                    {Math.round(
                      (stats.approvedUnspecified / approvedTotal) * 100
                    )}
                    %
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600">
                  Submitted before the &quot;How did you find me?&quot; field existed.
                </p>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Secondary breakdown — every submission, any status */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#FF6B2C]" />
            All submissions (incl. pending &amp; rejected)
          </h3>
          <span className="text-[10px] text-zinc-600">{submittedTotal} total</span>
        </div>

        {submittedTotal === 0 ? (
          <p className="text-xs text-zinc-500 italic">No reviews submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.submittedBySource.map((stat) => (
              <div
                key={stat.source}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60"
              >
                <span
                  className={`text-xs font-medium truncate ${
                    stat.count > 0 ? "text-zinc-200" : "text-zinc-500"
                  }`}
                >
                  {stat.label}
                </span>
                <span className="text-xs text-zinc-500 tabular-nums shrink-0">
                  <span
                    className={
                      stat.count > 0 ? "text-white font-bold" : "text-zinc-500"
                    }
                  >
                    {stat.count}
                  </span>
                  <span className="mx-1 text-zinc-700">·</span>
                  {stat.percentage}%
                </span>
              </div>
            ))}
            {stats.submittedUnspecified > 0 && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-xs font-medium italic text-zinc-500 truncate">
                  {REVIEW_SOURCE_UNKNOWN_LABEL}
                </span>
                <span className="text-xs text-zinc-500 tabular-nums shrink-0">
                  <span className="text-white font-bold">
                    {stats.submittedUnspecified}
                  </span>
                  <span className="mx-1 text-zinc-700">·</span>
                  {Math.round(
                    (stats.submittedUnspecified / submittedTotal) * 100
                  )}
                  %
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-[10px] text-zinc-600 leading-relaxed">
          Percentages are rounded and calculated against{" "}
          {approvedTotal === 0 ? "0" : approvedTotal} approved review
          {approvedTotal === 1 ? "" : "s"} in the main breakdown and{" "}
          {submittedTotal} submission{submittedTotal === 1 ? "" : "s"} in the
          secondary breakdown. No IP address, device fingerprint or location is
          collected — only the option the visitor selects.
        </p>
      </div>
    </div>
  );
}
