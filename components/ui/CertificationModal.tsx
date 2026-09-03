"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Award, Calendar, ShieldCheck, Hash, Building2 } from "lucide-react";
import { Certification } from "@/types/certification";

interface CertificationModalProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificationModal({
  certification,
  isOpen,
  onClose,
}: CertificationModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!certification) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800/90 bg-[#0d0e12] p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-left"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#FF6B2C]/40 hover:bg-[#FF6B2C]/10 transition-all duration-200 focus:outline-none cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Issuer */}
            <div className="flex items-start gap-4 pr-10 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/25 text-[#FF6B2C] shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Certification
                </div>
                <h2 id="cert-modal-title" className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {certification.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-[#FF6B2C]">
                  <Building2 className="w-4 h-4" />
                  <span>{certification.issuer}</span>
                </div>
              </div>
            </div>

            {/* Certificate Image or Decorative Placeholder */}
            <div className="relative mb-6 w-full aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950/80 group flex items-center justify-center">
              {certification.image ? (
                <Image
                  src={certification.image}
                  alt={certification.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain p-2"
                />
              ) : (
                /* Fallback Decorative Certificate Image Box */
                <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#12141c] via-[#0b0c10] to-[#151722]">
                  {/* Decorative Border Ring */}
                  <div className="absolute inset-3 border-2 border-dashed border-[#FF6B2C]/20 rounded-xl pointer-events-none" />
                  
                  {/* Center Emblem */}
                  <div className="p-4 rounded-full bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 text-[#FF6B2C] mb-3">
                    <Award className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-extrabold text-white max-w-md line-clamp-2">
                    {certification.title}
                  </h4>
                  <p className="text-xs text-[#FF6B2C] font-semibold mt-1">
                    Issued by {certification.issuer}
                  </p>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-semibold">Issue Date</p>
                  <p className="text-sm font-semibold text-zinc-200">{certification.date}</p>
                </div>
              </div>

              {certification.expirationDate && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase font-semibold">Expires</p>
                    <p className="text-sm font-semibold text-zinc-200">{certification.expirationDate}</p>
                  </div>
                </div>
              )}

              {certification.credentialId && (
                <div className="flex items-center gap-3 col-span-1 sm:col-span-2">
                  <div className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase font-semibold">Credential ID</p>
                    <p className="text-xs font-mono text-zinc-300 select-all">{certification.credentialId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {certification.description && (
              <div className="mb-6 space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                  Overview & Skills Validated
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/40">
                  {certification.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
              >
                Close
              </button>

              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all active:scale-95"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
