"use client";

import React from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Container from "@/components/layout/Container";
import CertificationCard from "@/components/ui/CertificationCard";
import { Certification } from "@/types/certification";

interface CertificationsProps {
  initialCertifications?: Certification[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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

export default function Certifications({ initialCertifications = [] }: CertificationsProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : itemVariants;

  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-[#0b0b0d] py-24 lg:py-32"
      aria-labelledby="certifications-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,_rgba(255,107,44,0.1),_transparent)]"
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
            Credentials
          </motion.span>
          <motion.h2
            id="certifications-heading"
            variants={variants}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Certifications
          </motion.h2>
          <motion.div
            variants={variants}
            className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#FF7A3D]"
          />
          <motion.p variants={variants} className="mt-4 max-w-xl text-base text-zinc-400">
            Verified credentials and learning milestones that support the portfolio narrative.
          </motion.p>
        </motion.header>

        {initialCertifications.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {initialCertifications.map((cert) => (
              <motion.div key={cert.id} variants={variants}>
                <CertificationCard certification={cert} className="h-full" />
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
              🏆
            </motion.div>
            <motion.p variants={variants} className="max-w-xs text-sm text-zinc-500">
              Certifications coming soon. Currently working towards new credentials.
            </motion.p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

export { Certifications };
