"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { Experience } from "@/types/experience";
import { deleteExperienceAction } from "@/actions/experience";

interface ExperienceTableProps {
  initialExperiences: Experience[];
}

export default function ExperienceTable({ initialExperiences }: ExperienceTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience entry?")) {
      setDeletingId(id);
      try {
        await deleteExperienceAction(id);
      } catch {
        alert("Failed to delete experience.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-4">
      {initialExperiences.length === 0 ? (
        <p className="text-xs text-zinc-500 italic py-6 text-center">No experience entries found.</p>
      ) : (
        <div className="space-y-4">
          {initialExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                  <span className="text-xs font-semibold text-[#FF6B2C]">@ {exp.company}</span>
                  {exp.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Present
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {exp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate || "N/A"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-900 text-zinc-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/experience/${exp.id}/edit`}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Edit Experience"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  disabled={deletingId === exp.id}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/20"
                  title="Delete Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
