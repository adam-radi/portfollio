import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  helperText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#FF6B2C]">*</span>}
        </span>
      </label>
      {children}
      {helperText && <p className="text-[11px] text-zinc-500">{helperText}</p>}
      {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}

export default FormField;
