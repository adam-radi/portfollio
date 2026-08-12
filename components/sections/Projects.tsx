"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Container from "@/components/layout/Container";
import ProjectCard from "@/components/ui/ProjectCard";
import { Project } from "@/types/project";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

interface ProjectsProps {
  initialProjects?: Project[];
}

export default function Projects({ initialProjects = [] }: ProjectsProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : itemVariants;

  const visibleProjects = initialProjects.filter((project) => project.published !== false);
  const featuredProjects = visibleProjects.filter((project) => project.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : visibleProjects;

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#0b0b0d] py-24 lg:py-32"
      aria-labelledby="projects-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_50%,_rgba(255,107,44,0.12),_transparent)]"
      />

      <Container>
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.span variants={variants} className="text-xs font-semibold uppercase tracking-widest text-[#FF6B2C]">
            What I&apos;ve Built
          </motion.span>
          <motion.h2
            id="projects-heading"
            variants={variants}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Projects
          </motion.h2>
          <motion.div
            variants={variants}
            className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D]"
          />
          <motion.p variants={variants} className="mt-4 max-w-xl text-base text-zinc-400">
            A selection of featured work across full-stack development, IT systems, and digital products.
          </motion.p>
        </motion.header>

        {displayProjects.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={variants}
                className={index === 0 ? "sm:col-span-2" : ""}
              >
                <ProjectCard project={project} featured={index === 0} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
          >
            <motion.div
              variants={variants}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-2xl text-[#FF6B2C]"
              aria-hidden="true"
            >
              🚀
            </motion.div>
            <motion.p variants={variants} className="max-w-xs text-sm text-zinc-500">
              Projects are coming soon. Stay tuned!
            </motion.p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

export { Projects };
