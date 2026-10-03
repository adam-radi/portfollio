"use client";

import React, { useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import {
  Star,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Quote,
  PenLine,
  X,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { LinkedinIcon } from "@/components/ui/icons";
import { PublicReview } from "@/types/review";
import {
  validateReview,
  ReviewErrors,
} from "@/lib/review-validation";

interface ReviewsProps {
  initialReviews?: PublicReview[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-colors";

function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= rating ? "fill-[#FF6B2C] text-[#FF6B2C]" : "text-zinc-700"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Reviews({ initialReviews = [] }: ReviewsProps) {
  const [reviews] = useState<PublicReview[]>(initialReviews);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ReviewErrors>({});
  const [showForm, setShowForm] = useState(false);

  const closeForm = () => {
    setShowForm(false);
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors({});
  };

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 0,
    linkedinUrl: "",
    websiteUrl: "",
    honeypot: "",
  });

  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : itemVariants;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    // Client-side validation (identical rules to the server)
    const result = validateReview(formData);
    if (!result.ok) {
      setFieldErrors(result.errors);
      setStatus("error");
      setErrorMessage("Please fix the highlighted fields.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors as ReviewErrors);
        throw new Error(data.error || "Failed to submit review.");
      }

      setStatus("success");
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 0,
        linkedinUrl: "",
        websiteUrl: "",
        honeypot: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section
      id="reviews"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0b0b0d]"
      aria-labelledby="reviews-heading"
    >
      {/* Orange Radial Background Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,_rgba(255,107,44,0.08),_transparent)] pointer-events-none"
      />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto space-y-14"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.span
              variants={variants}
              className="text-xs uppercase tracking-widest font-semibold text-[#FF6B2C]"
            >
              Testimonials
            </motion.span>
            <motion.h2
              id="reviews-heading"
              variants={variants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
            >
              What People Say
            </motion.h2>
            <motion.div
              variants={variants}
              className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D] rounded-full mx-auto"
            />
            <motion.p
              variants={variants}
              className="text-base sm:text-lg text-zinc-400 leading-relaxed pt-2"
            >
              Feedback from people I&apos;ve worked with — and a form to leave your own.
            </motion.p>
          </div>

          {/* Approved Reviews */}
          {reviews.length === 0 ? (
            <motion.div
              variants={variants}
              className="p-10 rounded-3xl bg-zinc-900/60 border border-[#FF6B2C]/15 text-center space-y-3"
            >
              <Quote className="w-8 h-8 mx-auto text-[#FF6B2C]" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">No reviews published yet</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Be the first to share your experience — submissions appear here once
                approved.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review, index) => (
                <motion.article
                  key={index}
                  variants={variants}
                  className="flex flex-col p-6 rounded-2xl bg-zinc-900/60 border border-[#FF6B2C]/15 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,107,44,0.05)] space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <StarRating rating={review.rating} />
                    <Quote className="w-5 h-5 text-[#FF6B2C]/40" aria-hidden="true" />
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-300 flex-1">
                    &ldquo;{review.content}&rdquo;
                  </p>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{review.name}</p>
                      {(review.role || review.company) && (
                        <p className="text-xs text-zinc-500 truncate">
                          {[review.role, review.company].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {review.linkedinUrl && (
                        <a
                          href={review.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          aria-label={`${review.name} on LinkedIn`}
                          className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-[#FF6B2C] hover:border-[#FF6B2C]/30 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                        >
                          <LinkedinIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Leave a Review — form trigger */}
          {!showForm && (
            <motion.div variants={variants} className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
              >
                <PenLine className="w-4 h-4" />
                <span>Leave a Review</span>
              </button>
            </motion.div>
          )}

          {/* Review Submission Form */}
          {showForm && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <form
              onSubmit={handleSubmit}
              className="relative p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-[#FF6B2C]/15 backdrop-blur-xl shadow-2xl space-y-5"
              noValidate
            >
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close review form"
                className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="space-y-1 text-center pb-1">
                <h3 className="text-lg font-bold text-white">Leave a Review</h3>
                <p className="text-xs text-zinc-500">
                  Your review is checked before it appears publicly.
                </p>
              </div>

              {/* Honeypot Anti-Spam Field (hidden visually) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  value={formData.honeypot}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Name */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label htmlFor="review-name" className="text-xs font-medium text-zinc-300">
                    Name <span className="text-[#FF6B2C]">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    name="name"
                    required
                    maxLength={80}
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.name}
                    className={inputClass}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-rose-400">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label htmlFor="review-role" className="text-xs font-medium text-zinc-300">
                    Role
                  </label>
                  <input
                    id="review-role"
                    type="text"
                    name="role"
                    maxLength={100}
                    placeholder="e.g. Founder"
                    value={formData.role}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.role}
                    className={inputClass}
                  />
                  {fieldErrors.role && (
                    <p className="text-xs text-rose-400">{fieldErrors.role}</p>
                  )}
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label htmlFor="review-company" className="text-xs font-medium text-zinc-300">
                    Company
                  </label>
                  <input
                    id="review-company"
                    type="text"
                    name="company"
                    maxLength={100}
                    placeholder="e.g. Acme Ltd"
                    value={formData.company}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.company}
                    className={inputClass}
                  />
                  {fieldErrors.company && (
                    <p className="text-xs text-rose-400">{fieldErrors.company}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-1.5">
                <span id="review-rating-label" className="text-xs font-medium text-zinc-300">
                  Rating <span className="text-[#FF6B2C]">*</span>
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="review-rating-label"
                  className="flex items-center gap-1.5"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={formData.rating === n}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: n }))}
                      className="p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          n <= formData.rating
                            ? "fill-[#FF6B2C] text-[#FF6B2C]"
                            : "text-zinc-700"
                        }`}
                      />
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-2 text-xs text-zinc-500">{formData.rating}/5</span>
                  )}
                </div>
                {fieldErrors.rating && (
                  <p className="text-xs text-rose-400">{fieldErrors.rating}</p>
                )}
              </div>

              {/* Review Content */}
              <div className="space-y-1.5">
                <label htmlFor="review-content" className="text-xs font-medium text-zinc-300">
                  Review <span className="text-[#FF6B2C]">*</span>
                </label>
                <textarea
                  id="review-content"
                  name="content"
                  rows={4}
                  required
                  maxLength={1000}
                  placeholder="Share your experience working with me..."
                  value={formData.content}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.content}
                  className={`${inputClass} resize-none`}
                />
                <div className="flex items-center justify-between gap-3">
                  {fieldErrors.content ? (
                    <p className="text-xs text-rose-400">{fieldErrors.content}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-zinc-600">
                    {formData.content.length}/1000
                  </span>
                </div>
              </div>

              {/* Optional Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="review-linkedin" className="text-xs font-medium text-zinc-300">
                    LinkedIn URL
                  </label>
                  <input
                    id="review-linkedin"
                    type="url"
                    name="linkedinUrl"
                    maxLength={500}
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.linkedinUrl}
                    className={inputClass}
                  />
                  {fieldErrors.linkedinUrl && (
                    <p className="text-xs text-rose-400">{fieldErrors.linkedinUrl}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="review-website" className="text-xs font-medium text-zinc-300">
                    Website URL
                  </label>
                  <input
                    id="review-website"
                    type="url"
                    name="websiteUrl"
                    maxLength={500}
                    placeholder="https://example.com"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.websiteUrl}
                    className={inputClass}
                  />
                  {fieldErrors.websiteUrl && (
                    <p className="text-xs text-rose-400">{fieldErrors.websiteUrl}</p>
                  )}
                </div>
              </div>

              {/* Status Feedback Banners */}
              {status === "success" && (
                <div
                  role="status"
                  className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Thank you. Your review has been submitted and is awaiting moderation.
                  </span>
                </div>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-950 bg-gradient-to-r from-[#FF6B2C] via-[#FF7A3D] to-[#FF8C4D] hover:from-[#FF7A3D] hover:via-[#FF8C4D] hover:to-[#FF9D5C] shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                <Globe className="w-3 h-3" aria-hidden="true" />
                Guest submission — no account required.
              </p>
            </form>
          </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}

export { Reviews };
