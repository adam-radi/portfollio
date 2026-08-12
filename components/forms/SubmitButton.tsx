"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label: string;
}

export function SubmitButton({ loading, label, className = "", ...props }: SubmitButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B2C] px-5 py-3 text-xs font-bold text-zinc-950",
        "shadow-lg shadow-[#FF6B2C]/20 transition-all hover:bg-[#FF7A3D] hover:shadow-[#FF6B2C]/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{label}</span>
    </button>
  );
}

export default SubmitButton;
