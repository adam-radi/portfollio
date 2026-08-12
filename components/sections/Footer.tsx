"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import Container from "@/components/layout/Container";
import { navigationLinks } from "@/data/navigation";
import { socials } from "@/data/socials";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#FF6B2C]/15 bg-background pt-16 pb-12 text-zinc-400">
      <Container>
        <div className="grid grid-cols-1 gap-10 border-b border-[#FF6B2C]/10 pb-12 md:grid-cols-12 items-start">
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <Link href="#hero" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF6B2C] via-[#FF7A3D] to-[#FF8C4D] text-sm font-extrabold text-zinc-950 shadow-md shadow-[#FF6B2C]/20 transition-transform duration-300 group-hover:scale-105">
                AR
              </div>
              <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#FF6B2C]">
                Adam <span className="font-normal text-zinc-400">Radi</span>
              </span>
            </Link>

            <p className="mx-auto max-w-sm text-xs leading-relaxed text-zinc-400 md:mx-0">
              Full Stack Developer • IT Support Specialist • Exocad 3D CAD Designer. Building digital products with precision, performance, and clean architecture.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3 text-center md:text-left">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#FF6B2C]">Navigation</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-zinc-400">
              {navigationLinks.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="inline-block py-1 transition-colors hover:text-[#FF6B2C]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col items-center space-y-4 md:items-end">
            <h3 className="self-center text-xs font-semibold uppercase tracking-widest text-[#FF6B2C] md:self-end">
              Connect
            </h3>
            <div className="flex items-center gap-2.5">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label} Profile`}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-[#FF6B2C]/40 hover:text-[#FF6B2C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top of page"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-[#FF6B2C]/40 hover:text-[#FF6B2C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Adam Radi. All rights reserved.</p>
          <p className="text-[11px] text-zinc-600">Built with Next.js 16, React 19, TypeScript & Tailwind CSS</p>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
