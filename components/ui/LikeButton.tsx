"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLikeAction } from "@/actions/likes";
import { getLikeState, setLikeState } from "@/lib/like-batch";
import type { LikeEntityType } from "@/types/like";

export interface LikeButtonProps {
  entityType: LikeEntityType;
  entityId: string;
  /** Server-rendered like count — never trusted for writes. */
  count?: number;
  /** Human readable entity name used for accessible labels. */
  entityLabel?: string;
  /** Shows the "Like" / "Liked" text next to the heart. */
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function LikeButton({
  entityType,
  entityId,
  count = 0,
  entityLabel,
  showLabel = false,
  size = "sm",
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(count);
  const [hydrated, setHydrated] = useState(false);
  const [pending, setPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Guards against double-click duplicate requests.
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;

    getLikeState(entityType, entityId)
      .then((state) => {
        if (!active) return;
        if (state) {
          setLiked(state.liked);
          setLikeCount(state.count);
        }
        setHydrated(true);
      })
      .catch(() => {
        if (!active) return;
        setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [entityType, entityId]);

  const handleToggle = useCallback(async () => {
    if (!hydrated || inFlight.current) return;

    inFlight.current = true;
    setPending(true);
    setStatusMessage("");

    const previousLiked = liked;
    const previousCount = likeCount;

    // Optimistic update — rolled back if the server disagrees.
    const nextLiked = !previousLiked;
    setLiked(nextLiked);
    setLikeCount(Math.max(0, previousCount + (nextLiked ? 1 : -1)));

    try {
      const result = await toggleLikeAction(entityType, entityId);

      if (result.ok) {
        const likedNow = Boolean(result.liked);
        const countNow = typeof result.count === "number" ? result.count : likeCount;
        setLiked(likedNow);
        setLikeCount(countNow);
        setLikeState(entityType, entityId, { liked: likedNow, count: countNow });
      } else {
        setLiked(previousLiked);
        setLikeCount(previousCount);
        setStatusMessage(result.error || "Could not update your like.");
      }
    } catch {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      setStatusMessage("Could not update your like. Please try again.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }, [entityType, entityId, hydrated, likeCount, liked]);

  const name = entityLabel ? entityLabel : entityType.toLowerCase();
  const busy = pending || !hydrated;

  return (
    <span className="inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        aria-pressed={liked}
        aria-busy={busy}
        aria-label={liked ? `Unlike ${name}` : `Like ${name}`}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full border font-semibold",
          "transition-colors duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]",
          "disabled:cursor-default",
          size === "sm" ? "h-6 px-2 text-[11px]" : "h-8 px-3 text-xs",
          liked
            ? "border-[#FF6B2C]/35 bg-[#FF6B2C]/10 text-[#FF6B2C] hover:bg-[#FF6B2C]/15"
            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-[#FF6B2C] hover:border-[#FF6B2C]/40",
          busy && "opacity-70",
          className
        )}
      >
        {pending ? (
          <Loader2
            className={cn("animate-spin", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")}
            aria-hidden="true"
          />
        ) : (
          <Heart
            className={cn(
              liked ? "fill-current" : "fill-none",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
            )}
            aria-hidden="true"
          />
        )}
        <span className="tabular-nums">{likeCount}</span>
        {showLabel && <span>{liked ? "Liked" : "Like"}</span>}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </span>
  );
}
