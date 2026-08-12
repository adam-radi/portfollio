"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/button";
import { navigationLinks, NavItemExtended } from "@/data/navigation";

interface NavbarProps {
  items?: NavItemExtended[];
  cvUrl?: string;
}

export default function Navbar({
  items = navigationLinks,
  cvUrl = "/cv/adam-radi-cv.pdf",
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0b0b0d]/90 backdrop-blur-xl border-b border-zinc-800/80 py-3 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <Container>
          <nav className="flex items-center justify-between" aria-label="Main Navigation">
            {/* Brand Logo with Orange Gradient */}
            <Link
              href="#hero"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B2C] via-[#FF7A3D] to-amber-500 flex items-center justify-center text-zinc-950 font-extrabold text-sm shadow-lg shadow-[#FF6B2C]/20 group-hover:scale-105 transition-transform duration-300">
                AR
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none text-white tracking-tight group-hover:text-[#FF6B2C] transition-colors">
                  Adam <span className="text-zinc-400 font-normal">Radi</span>
                </span>
                <span className="text-[10px] text-[#FF6B2C] tracking-wider uppercase font-semibold">Developer</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-[#12141a]/80 p-1.5 rounded-full border border-zinc-800/80 backdrop-blur-md shadow-inner">
              {items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Actions / CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                href={cvUrl}
                variant="primary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                iconPosition="left"
                className="shadow-[#FF6B2C]/20"
              >
                Download CV
              </Button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FF6B2C]" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-50 p-6 rounded-3xl bg-[#12141a]/95 border border-zinc-800/90 backdrop-blur-2xl shadow-2xl md:hidden space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Navigation</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 font-bold">
                  Adam Radi
                </span>
              </div>

              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                        isActive
                          ? "bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500 opacity-60" />
                    </a>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <Button
                  href={cvUrl}
                  variant="primary"
                  size="md"
                  className="w-full justify-center shadow-lg"
                  icon={<Download className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Download CV
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { Navbar };
