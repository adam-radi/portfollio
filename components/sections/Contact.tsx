"use client";

import React, { useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { Mail, Copy, Check, Send, Loader2, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/button";
import { socials } from "@/data/socials";

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

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : itemVariants;
  const email = "radi.adam.2006@gmail.com";
  const whatsappNumber = "212702881862";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0b0b0d]"
      aria-labelledby="contact-heading"
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
          className="max-w-5xl mx-auto space-y-16"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.span variants={variants} className="text-xs uppercase tracking-widest font-semibold text-[#FF6B2C]">
              Let&apos;s Connect
            </motion.span>
            <motion.h2
              id="contact-heading"
              variants={variants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
            >
              Get In Touch
            </motion.h2>
            <motion.div
              variants={variants}
              className="w-12 h-0.5 bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D] rounded-full mx-auto"
            />
            <motion.p variants={variants} className="text-base sm:text-lg text-zinc-400 leading-relaxed pt-2">
              Whether you have a project in mind, need IT support & infrastructure guidance, or are looking for digital dental CAD solutions with Exocad — feel free to reach out!
            </motion.p>
          </div>

          {/* Grid Layout: Left Info & Copy / Right Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Info Panel (5 cols) */}
            <motion.div variants={variants} className="lg:col-span-5 space-y-6">
              {/* Email Direct Action Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-[#FF6B2C]/15 backdrop-blur-md space-y-4 shadow-[0_0_0_1px_rgba(255,107,44,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 text-[#FF6B2C]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Direct Email</h3>
                    <p className="text-sm font-medium text-zinc-200">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy email address to clipboard"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <Button
                    href={`mailto:${email}`}
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Open Mail App
                  </Button>
                </div>

                <div className="pt-1">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#1fae57] text-black font-semibold px-4 py-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                    aria-label="Open WhatsApp chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-[#FF6B2C]/15 backdrop-blur-md space-y-4 shadow-[0_0_0_1px_rgba(255,107,44,0.05)]">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Social Profiles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {socials.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.label} Profile`}
                        className={`flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 transition-all duration-300 ${item.hoverColor || "hover:text-white hover:border-zinc-600"
                          } hover:-translate-y-0.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Contact Form (7 cols) */}
            <motion.div variants={variants} className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-[#FF6B2C]/15 backdrop-blur-xl shadow-2xl space-y-5"
                noValidate
              >
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-medium text-zinc-300">
                      Your Name <span className="text-[#FF6B2C]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      placeholder="Adam Radi"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-medium text-zinc-300">
                      Your Email <span className="text-[#FF6B2C]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-medium text-zinc-300">
                    Subject <span className="text-[#FF6B2C]">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    required
                    placeholder="Project Inquiry / Collaboration"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-colors"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-medium text-zinc-300">
                    Message <span className="text-[#FF6B2C]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell me about your project or inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-colors resize-none"
                  />
                </div>

                {/* Status Feedback Banners */}
                {status === "success" && (
                  <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-950 bg-gradient-to-r from-[#FF6B2C] sm:max-w-full via-[#FF7A3D] to-[#FF8C4D] hover:from-[#FF7A3D] hover:via-[#FF8C4D] hover:to-[#FF9D5C] shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export { Contact };
