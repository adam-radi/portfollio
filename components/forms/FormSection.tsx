import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#111319] p-6 space-y-6",
        "before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(circle_at_top_left,_rgba(255,107,44,0.08),_transparent_45%)]",
        className
      )}
    >
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-gradient-to-b from-[#FF7A3D] to-[#E85A20]" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B2C]">
              {title}
            </h2>
            {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
          </div>
        </div>
      </header>

      {children}
    </section>
  );
}

export default FormSection;
