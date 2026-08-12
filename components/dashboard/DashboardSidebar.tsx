"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Wrench,
  Award,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { AdminSession } from "@/lib/auth";

interface DashboardSidebarProps {
  user: AdminSession;
}

const navItems = [
  { label: "Overview",       href: "/dashboard",                  icon: LayoutDashboard, exact: true },
  { label: "Projects",       href: "/dashboard/projects",         icon: FolderKanban,    exact: false },
  { label: "Experience",     href: "/dashboard/experience",       icon: Briefcase,       exact: false },
  { label: "Skills",         href: "/dashboard/skills",           icon: Wrench,          exact: false },
  { label: "Certifications", href: "/dashboard/certifications",   icon: Award,           exact: false },
  { label: "Messages",       href: "/dashboard/messages",         icon: MessageSquare,   exact: false },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  };

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const active = isActive(item.href, item.exact);
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group",
          active
            ? "bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20"
            : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            active ? "text-[#FF6B2C]" : "text-zinc-500 group-hover:text-[#FF6B2C]"
          )}
        />
        <span>{item.label}</span>
        {active && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" aria-hidden="true" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* ── Mobile Topbar ─────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111319] border-b border-zinc-800/80 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-amber-500 text-zinc-950 flex items-center justify-center font-extrabold text-xs">
            AR
          </div>
          <span className="font-bold text-sm text-white">Admin Panel</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111319] border-r border-zinc-800/80 p-5 shrink-0 min-h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] via-[#FF7A3D] to-amber-500 text-zinc-950 flex items-center justify-center font-extrabold text-sm shadow-md shadow-[#FF6B2C]/20 shrink-0">
            AR
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm text-white tracking-tight leading-none truncate">
              Adam Radi
            </p>
            <p className="text-[10px] text-[#FF6B2C] font-semibold tracking-wider uppercase mt-1">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-5 mt-5 border-t border-zinc-800/80 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              Public Portfolio
            </span>
            <span className="text-[10px] text-zinc-600">↗</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer Overlay ─────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-72 h-full bg-[#111319] border-r border-zinc-800 flex flex-col p-6">
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-amber-500 text-zinc-950 flex items-center justify-center font-extrabold text-xs">
                  AR
                </div>
                <span className="font-bold text-sm text-white">Adam Radi</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5" aria-label="Mobile dashboard navigation">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            <div className="pt-5 border-t border-zinc-800 space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Public Portfolio
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
