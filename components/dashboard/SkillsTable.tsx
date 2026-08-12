"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Skill } from "@/types/skill";
import { deleteSkillAction } from "@/actions/skills";

interface SkillsTableProps {
  initialSkills: Skill[];
}

export default function SkillsTable({ initialSkills }: SkillsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      setDeletingId(id);
      try {
        await deleteSkillAction(id);
      } catch {
        alert("Failed to delete skill.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {initialSkills.map((skill) => (
        <div
          key={skill.id}
          className="p-4 rounded-2xl bg-[#111319] border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl shrink-0">{skill.icon || "⚡"}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{skill.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#FF6B2C] font-semibold uppercase tracking-wider">
                  {skill.category}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium capitalize">
                  • {skill.level}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/dashboard/skills/${skill.id}/edit`}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Edit Skill"
            >
              <Edit className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(skill.id)}
              disabled={deletingId === skill.id}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors"
              title="Delete Skill"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
