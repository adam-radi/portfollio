import React from "react";
import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  Wrench,
  Award,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getProjects, getExperiences, getSkills, getCertifications } from "@/lib/db/data-fetchers";
import { prisma } from "@/lib/prisma";

async function getUnreadMessagesCount(): Promise<number> {
  try {
    if (!process.env.DATABASE_URL || !prisma?.message) return 0;
    return await prisma.message.count({ where: { read: false } });
  } catch {
    return 0;
  }
}

export default async function DashboardOverviewPage() {
  const [projects, experiences, skills, certs, unreadMessages] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getCertifications(),
    getUnreadMessagesCount(),
  ]);

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      href: "/dashboard/projects",
      icon: FolderKanban,
      color: "text-[#FF6B2C]",
      bgColor: "bg-[#FF6B2C]/10",
      borderColor: "border-[#FF6B2C]/20",
    },
    {
      title: "Work Experience",
      value: experiences.length,
      href: "/dashboard/experience",
      icon: Briefcase,
      color: "text-[#FF6B2C]",
      bgColor: "bg-[#FF6B2C]/10",
      borderColor: "border-[#FF6B2C]/20",
    },
    {
      title: "Technical Skills",
      value: skills.length,
      href: "/dashboard/skills",
      icon: Wrench,
      color: "text-[#FF6B2C]",
      bgColor: "bg-[#FF6B2C]/10",
      borderColor: "border-[#FF6B2C]/20",
    },
    {
      title: "Certifications",
      value: certs.length,
      href: "/dashboard/certifications",
      icon: Award,
      color: "text-[#FF6B2C]",
      bgColor: "bg-[#FF6B2C]/10",
      borderColor: "border-[#FF6B2C]/20",
    },
    {
      title: "Unread Messages",
      value: unreadMessages,
      href: "/dashboard/messages",
      icon: MessageSquare,
      color: "text-[#FF6B2C]",
      bgColor: "bg-[#FF6B2C]/10",
      borderColor: "border-[#FF6B2C]/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B2C]">
            Admin Overview
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your portfolio content, projects, experience, and contact messages.
          </p>
        </div>

        {/* Quick Action Button */}
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group p-5 rounded-2xl bg-[#111319] border border-zinc-800/80 hover:border-zinc-700 transition-all hover:-translate-y-0.5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${item.bgColor} ${item.borderColor} border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#FF6B2C] group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <p className="text-2xl font-extrabold text-white tracking-tight">{item.value}</p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">{item.title}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Overview Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Projects Showcase (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#FF6B2C]" />
              Projects List
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-[#FF6B2C] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition-all"
              >
                <div>
                  <h3 className="text-xs font-bold text-white">{proj.title}</h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{proj.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Status & Info (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF6B2C]" />
              System Status
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-400">Environment</span>
              <span className="font-semibold text-emerald-400">Production Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-400">Database Connection</span>
              <span className="font-semibold text-[#FF6B2C]">Prisma / Fallback Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-400">Public Portfolio</span>
              <a href="/" target="_blank" className="font-semibold text-[#FF6B2C] hover:underline flex items-center gap-1">
                <span>View Live Site</span>
                <Sparkles className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}