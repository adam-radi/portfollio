"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Container from "@/components/layout/Container";
import SkillCard from "@/components/ui/SkillCard";
import { Skill, SkillCategory } from "@/types/skill";
import { skills as staticSkills } from "@/data/skills";

interface SkillsProps {
  initialSkills?: Skill[];
}

const categories: { id: SkillCategory; label: string; emoji: string }[] = [
  { id: "frontend", label: "Frontend",             emoji: "🖥️" },
  { id: "backend",  label: "Backend",              emoji: "⚙️" },
  { id: "database", label: "Database",             emoji: "🗄️" },
  { id: "devops",   label: "DevOps",               emoji: "🚀" },
  { id: "tools",    label: "Tools",                emoji: "🛠️" },
  { id: "dental",   label: "Dental Technologies",  emoji: "🦷" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
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

export default function Skills({ initialSkills = [] }: SkillsProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : itemVariants;

  const allSkills = initialSkills && initialSkills.length > 0 ? initialSkills : staticSkills;

  return (
    <section
      id="skills"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0b0b0d]"
      aria-labelledby="skills-heading"
    >
      {/* Orange Radial Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,_rgba(255,107,44,0.06),_transparent)] pointer-events-none"
      />

      <Container>
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.span
            variants={variants}
            className="text-xs uppercase tracking-widest font-extrabold text-[#FF6B2C]"
          >
            What I Know
          </motion.span>
          <motion.h2
            id="skills-heading"
            variants={variants}
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            Skills & Competencies
          </motion.h2>
          <motion.div
            variants={variants}
            className="mt-4 w-12 h-0.5 bg-gradient-to-r from-[#FF6B2C] to-amber-500 rounded-full"
          />
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
          {categories.map((cat) => {
            const catSkills = allSkills.filter((s) => s.category === cat.id);
            if (catSkills.length === 0) return null;

            return (
              <motion.div
                key={cat.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={containerVariants}
              >
                {/* Category Header */}
                <motion.div variants={variants} className="flex items-center gap-2 mb-5">
                  <span className="text-base leading-none" aria-hidden="true">
                    {cat.emoji}
                  </span>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B2C]">
                    {cat.label}
                  </h3>
                  <div className="flex-1 h-px bg-[#FF6B2C]/20 ml-2" />
                </motion.div>

                {/* Skill Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {catSkills.map((skill) => (
                    <motion.div key={skill.id} variants={variants}>
                      <SkillCard skill={skill} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export { Skills };
