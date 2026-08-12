"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-2xl",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#FF6B2C] via-[#FF7A3D] to-[#FF8C4D] hover:from-[#FF7A3D] hover:via-[#FF8C4D] hover:to-[#FF9D5C] text-zinc-950 shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 hover:-translate-y-0.5 border border-[#FF6B2C]/20",
    secondary:
      "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-md backdrop-blur-md hover:-translate-y-0.5 hover:border-zinc-500/60",
    outline:
      "bg-transparent border border-zinc-700 text-zinc-300 hover:text-white hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/10 hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent",
  };

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">{icon}</span>
      )}
    </>
  );

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    "group",
    className
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.endsWith(".pdf");
    return (
      <Link
        href={href}
        className={combinedClasses}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={onClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClasses} onClick={onClick}>
      {content}
    </button>
  );
}
