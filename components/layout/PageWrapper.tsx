import React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("relative min-h-screen flex flex-col overflow-hidden bg-background", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,_rgba(255,107,44,0.14),_transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 h-[420px] w-[420px] rounded-full bg-[#FF6B2C]/5 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-[360px] w-[360px] rounded-full bg-[#FF6B2C]/6 blur-[120px]"
      />
      {children}
    </div>
  );
}

export default PageWrapper;
