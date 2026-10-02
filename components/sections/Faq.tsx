"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/layout/Container";
import { faqItems, FaqItem } from "@/data/faq";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
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

function AnswerText({ item }: { item: FaqItem }) {
  return (
    <>
      {item.answer.map((part, i) =>
        part.href ? (
          <Link
            key={i}
            href={part.href}
            className="font-semibold text-[#FF6B2C] hover:text-[#FF8C4D] underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] rounded-sm"
          >
            {part.text}
          </Link>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : itemVariants;

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      id="faq"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0d0e12]"
      aria-labelledby="faq-heading"
    >
      {/* Subtle Orange Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,_rgba(255,107,44,0.08),_transparent)] pointer-events-none"
      />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Section Heading */}
          <motion.header variants={variants} className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6B2C]">
              FAQ
            </span>
            <h2
              id="faq-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Questions fréquentes
            </h2>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D]" />
            <p className="mt-4 max-w-xl text-base text-zinc-400">
              Les réponses aux questions les plus fréquentes sur mon profil, mes compétences et mes
              projets.
            </p>
          </motion.header>

          {/* Accordion List */}
          <motion.div variants={containerVariants} className="space-y-4">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              const buttonId = `faq-question-${item.id}`;
              const panelId = `faq-answer-${item.id}`;

              return (
                <motion.div
                  key={item.id}
                  variants={variants}
                  className={`rounded-2xl border bg-[#12141a]/80 transition-all duration-300 ${
                    isOpen
                      ? "border-[#FF6B2C]/40"
                      : "border-zinc-800/80 hover:border-[#FF6B2C]/30"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className="group flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6B2C]"
                    >
                      <span
                        className={`text-sm sm:text-base font-semibold transition-colors ${
                          isOpen ? "text-[#FF6B2C]" : "text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 border-[#FF6B2C]/40 bg-[#FF6B2C]/10 text-[#FF6B2C]"
                            : "border-zinc-700/60 bg-zinc-900/80 text-zinc-400 group-hover:border-[#FF6B2C]/30 group-hover:text-[#FF6B2C]"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed text-zinc-400">
                          <AnswerText item={item} />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export { Faq };
