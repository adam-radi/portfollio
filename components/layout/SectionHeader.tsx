import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  titleId?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  titleId,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "space-y-3",
        align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-xl",
        className
      )}
    >
      <span className="text-xs uppercase tracking-widest font-semibold text-[#FF6B2C]">
        {eyebrow}
      </span>
      <h2
        id={titleId}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
      >
        {title}
      </h2>
      <div
        className={cn(
          "w-12 h-0.5 bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D] rounded-full",
          align === "center" && "mx-auto"
        )}
      />
      {description && (
        <p className="text-base text-zinc-400 leading-relaxed pt-1">
          {description}
        </p>
      )}
    </header>
  );
}

export default SectionHeader;
