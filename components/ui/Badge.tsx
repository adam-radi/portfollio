import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "cyan" | "indigo" | "outline";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  icon,
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 font-medium rounded-full backdrop-blur-md transition-colors";

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-xs sm:text-sm",
  };

  const variants = {
    default: "bg-blue-500/10 border border-blue-500/20 text-blue-300",
    success: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    cyan: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300",
    indigo: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300",
    outline: "bg-zinc-900/60 border border-zinc-800 text-zinc-300",
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
