"use client";

import React, { useMemo, useRef, useState } from "react";
import { ImagePlus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  accept?: string;
  className?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  helperText,
  accept = "image/*",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const previewSrc = useMemo(() => {
    if (!value || previewError) return null;
    return value.trim() ? value : null;
  }, [value, previewError]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewError(false);
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">{label}</label>
          {helperText && <p className="text-[11px] text-zinc-500">{helperText}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-[#FF6B2C]/40 hover:text-white"
          >
            <Upload className="h-3.5 w-3.5 text-[#FF6B2C]" />
            <span>{value ? "Replace" : "Upload"}</span>
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-rose-500/30 hover:text-rose-300"
            >
              <X className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewSrc ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 text-xs text-zinc-400">
            <ImagePlus className="h-4 w-4 text-[#FF6B2C]" />
            <span>Preview</span>
          </div>
          <div className="p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt={label}
              onError={() => setPreviewError(true)}
              className="max-h-48 w-full rounded-xl object-contain bg-[#0b0b0b]"
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 text-xs text-zinc-500">
          No image selected.
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
