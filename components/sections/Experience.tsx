"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Container from "@/components/layout/Container";
import ExperienceCard from "@/components/ui/ExperienceCard";
import { Experience as ExperienceType } from "@/types/experience";

interface ExperienceProps {
  initialExperiences?: ExperienceType[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const lineVariants: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export default function Experience({ initialExperiences = [] }: ExperienceProps) {
  const shouldReduceMotion = useReducedMotion();
  const headingVariants = shouldReduceMotion ? reducedVariants : {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section
      id="experience"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0d0e12]"
      aria-labelledby="experience-heading"
    >
      {/* Orange Subtle Background Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,_rgba(255,107,44,0.06),_transparent)] pointer-events-none"
      />

      <Container>
        {/* Section Header */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.span variants={headingVariants} className="text-xs uppercase tracking-widest font-extrabold text-[#FF6B2C]">
            My Journey
          </motion.span>
          <motion.h2
            id="experience-heading"
            variants={headingVariants}
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            Work Experience
          </motion.h2>
          <motion.div
            variants={headingVariants}
            className="mt-4 w-12 h-0.5 bg-gradient-to-r from-[#FF6B2C] to-amber-500 rounded-full"
          />
          <motion.p variants={headingVariants} className="mt-4 text-base text-zinc-400 max-w-xl">
            My professional background spans web development, IT infrastructure, and precision dental CAD design.
          </motion.p>
        </motion.header>

        {/* Timeline Container */}
        <div className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={containerVariants}
            className="space-y-0"
          >
            {initialExperiences.map((exp, index) => (
              <div key={exp.id} className="relative grid grid-cols-1 lg:grid-cols-[180px_48px_1fr] gap-0 items-start">
                
                {/* Desktop Date Column */}
                <motion.div
                  variants={headingVariants}
                  className="hidden lg:flex flex-col items-end pr-6 pt-6 text-right"
                >
                  <span className="text-xs font-extrabold text-[#FF6B2C]">
                    {exp.startDate.split("-")[0]}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium mt-0.5">
                    {exp.endDate ? exp.endDate.split("-")[0] : "Present"}
                  </span>
                </motion.div>

                {/* Timeline: Orange Dot + Orange Vertical Line */}
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  <motion.div
                    variants={headingVariants}
                    className="relative z-10 mt-6 w-4 h-4 rounded-full border-2 border-[#FF6B2C] bg-zinc-950 flex items-center justify-center shrink-0 shadow-md shadow-[#FF6B2C]/30"
                  >
                    {exp.current && (
                      <span className="absolute w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" />
                    )}
                  </motion.div>

                  {/* Orange Vertical Line */}
                  {index < initialExperiences.length - 1 && (
                    <motion.div
                      variants={shouldReduceMotion ? reducedVariants : lineVariants}
                      className="w-px flex-1 min-h-[3rem] bg-gradient-to-b from-[#FF6B2C] via-[#FF6B2C]/40 to-zinc-800/40 mt-1"
                    />
                  )}
                </div>

                {/* Card */}
                <motion.div
                  variants={headingVariants}
                  className="pl-6 pb-12 pt-2 lg:pt-0"
                >
                  <ExperienceCard experience={exp} />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export { Experience };
