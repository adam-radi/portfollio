"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Edit, Trash2, Star, Plus } from "lucide-react";
import { Project } from "@/types/project";
import { deleteProjectAction, toggleFeaturedProjectAction } from "@/actions/projects";

interface ProjectTableProps {
  initialProjects: Project[];
}

export function ProjectTable({ initialProjects }: ProjectTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProjects = initialProjects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      setDeletingId(id);
      try {
        await deleteProjectAction(id);
      } catch (err) {
        alert("Failed to delete project.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await toggleFeaturedProjectAction(id, !currentStatus);
    } catch {
      alert("Failed to update featured status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111319] border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>

        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Projects List Container */}
      <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500 italic">
            No projects match your search criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition-all gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{proj.title}</h3>

                    {!proj.published && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-zinc-500 border border-zinc-800">
                        Hidden
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(proj.id, proj.featured)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 transition-colors ${
                        proj.featured
                          ? "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                      }`}
                      title="Toggle Featured Status"
                    >
                      <Star className={`w-3 h-3 ${proj.featured ? "fill-[#FF6B2C]" : ""}`} />
                      <span>{proj.featured ? "Featured" : "Standard"}</span>
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-900 text-zinc-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/projects/${proj.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/dashboard/projects/${proj.id}/edit`}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    disabled={deletingId === proj.id}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-colors disabled:opacity-50"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectTable;
