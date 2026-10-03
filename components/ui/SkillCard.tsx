"use client";

import React from "react";
import { cn } from "@/lib/utils";
import LikeButton from "@/components/ui/LikeButton";
import type { Skill, SkillLevel } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  likeCount?: number;
  className?: string;
}

const levelConfig: Record<SkillLevel, { label: string; width: string; color: string }> = {
  beginner:     { label: "Beginner",     width: "w-1/4",  color: "bg-[#FF6B2C]/40" },
  intermediate: { label: "Intermediate", width: "w-2/4",  color: "bg-[#FF6B2C]/70" },
  advanced:     { label: "Advanced",     width: "w-3/4",  color: "bg-[#FF6B2C]" },
  expert:       { label: "Expert",       width: "w-full", color: "bg-gradient-to-r from-[#FF6B2C] to-amber-400" },
};

export default function SkillCard({ skill, likeCount = 0, className }: SkillCardProps) {
  const level = skill.level ? levelConfig[skill.level] : levelConfig.intermediate;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 min-w-[120px] p-3.5 rounded-2xl border border-zinc-800/80 bg-[#12141a]/80",
        "hover:border-[#FF6B2C]/50 hover:bg-[#161822] hover:-translate-y-0.5",
        "transition-all duration-300 shadow-sm",
        className
      )}
    >
      {/* Icon */}
      {skill.icon && (
        <span
          className="text-xl leading-none mt-0.5 shrink-0 w-7 text-center group-hover:scale-110 transition-transform"
          aria-hidden="true"
        >
          {skill.icon}
        </span>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-zinc-100 leading-none mb-1.5 truncate group-hover:text-[#FF6B2C] transition-colors">
          {skill.name}
        </p>

        {/* Orange Level Bar */}
        {level && (
          <div className="mt-2">
            <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  level.color,
                  level.width
                )}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <p className="text-[10px] text-zinc-500 font-medium truncate">{level.label}</p>
              <LikeButton
                entityType="SKILL"
                entityId={skill.id}
                count={likeCount}
                entityLabel={skill.name}
                size="sm"
                className="shrink-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
