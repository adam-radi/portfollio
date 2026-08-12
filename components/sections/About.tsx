"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Container from "@/components/layout/Container";
import { about } from "@/data/about";

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
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export default function About() {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedItemVariants : itemVariants;

  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0d0e12]"
      aria-labelledby="about-heading"
    >
      {/* Subtle Orange Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,_rgba(255,107,44,0.08),_transparent)] pointer-events-none"
      />

      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Heading with Orange Accent */}
          <motion.div variants={variants} className="mb-16">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#FF6B2C]">
              Who I Am
            </span>
            <h2
              id="about-heading"
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
            >
              About Me
            </h2>
            <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-[#FF6B2C] to-amber-500 rounded-full" />
          </motion.div>

          {/* Desktop: 2-col | Mobile: stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Intro + Story */}
            <motion.div
              variants={containerVariants}
              className="lg:col-span-7 space-y-6 border-l-2 border-[#FF6B2C]/30 pl-6 lg:pl-8"
            >
              {/* Intro */}
              <motion.p
                variants={variants}
                className="text-lg sm:text-xl text-zinc-200 leading-relaxed font-semibold"
              >
                {about.intro}
              </motion.p>

              {/* Story paragraphs */}
              {about.story.map((paragraph, i) => (
                <motion.p
                  key={i}
                  variants={variants}
                  className="text-base text-zinc-400 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}

              {/* Domain Pills */}
              <motion.div variants={variants} className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20">
                  Full Stack Web Development
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF7A3D]/10 text-[#FF7A3D] border border-[#FF7A3D]/20">
                  IT Infrastructure & Support
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E85A20]/10 text-[#E85A20] border border-[#E85A20]/20">
                  Exocad 3D Dental CAD
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Stats Cards */}
            <motion.div
              variants={containerVariants}
              className="lg:col-span-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1"
            >
              {about.stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  variants={variants}
                  className="flex flex-col gap-1.5 p-6 rounded-2xl border border-zinc-800/80 bg-[#12141a]/80 hover:border-[#FF6B2C]/40 hover:bg-[#151720] transition-all duration-300 group"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FF6B2C] group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export { About };
