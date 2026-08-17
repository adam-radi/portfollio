"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Download, Sparkles, Code, Server, Layers } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/button";
import { socials } from "@/data/socials";

// Load the Three.js scene lazily so it doesn't block the initial bundle/LCP.
const HeroImage = dynamic(() => import("@/components/ui/HeroImage"), {
  ssr: false,
  loading: () => (
    <div className="relative flex items-center justify-center w-full max-w-lg mx-auto aspect-square" />
  ),
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0b0b0d]">
      {/* Orange Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#FF6B2C]/20 via-[#FF7A3D]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#FF6B2C]/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* LEFT COLUMN: Bio & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
            
            {/* Status Pill Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B2C]/10 border border-[#FF6B2C]/25 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B2C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B2C]" />
                </span>
                <span className="text-xs font-semibold text-[#FF6B2C] tracking-wide">
                  Available for New Projects 
                </span>
              </div>
            </motion.div>

            {/* Greeting & Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#FF6B2C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF6B2C]" /> Welcome to my portfolio
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I&apos;m{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-[#FF6B2C]">
                  Adam Radi
                </span>
              </h1>
            </motion.div>

            {/* Roles / Specializations */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#14161d] border border-[#FF6B2C]/30 text-[#FF6B2C]">
                <Code className="w-3.5 h-3.5" /> Full Stack Developer
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#14161d] border border-[#FF7A3D]/25 text-zinc-300">
                <Server className="w-3.5 h-3.5 text-[#FF7A3D]" /> IT Support Specialist
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#14161d] border border-[#E85A20]/25 text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-[#E85A20]" /> Exocad 3D CAD Designer
              </span>
            </motion.div>

            {/* Pitch Description */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              I build modern, high-performance web applications, architect secure IT infrastructure, and design digital dental 3D restorations with Exocad.
            </motion.p>

            {/* Call to Action Buttons with Orange Accent */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 transition-all duration-300 active:scale-95"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Button
                href="/cv/adam-radi-cv.pdf"
                variant="secondary"
                size="lg"
                icon={<Download className="w-4 h-4" />}
                iconPosition="left"
              >
                Download CV
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="pt-4 space-y-3">
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Connect with me</p>
              <div className="flex items-center gap-3">
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-[#FF6B2C] hover:border-[#FF6B2C]/40 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Highlights / Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 w-full">
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-[#FF6B2C]">3+</p>
                <p className="text-xs text-zinc-500 font-medium">Core Expertise Domains</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-zinc-500 font-medium">Clean Code & Precision</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-zinc-300">Exocad</p>
                <p className="text-xs text-zinc-500 font-medium">Digital Dental CAD</p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: 3D Visual */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <HeroImage />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
