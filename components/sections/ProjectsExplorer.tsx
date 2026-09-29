"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Filter } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/types/project";

interface ProjectsExplorerProps {
  initialProjects: Project[];
}

export default function ProjectsExplorer({ initialProjects }: ProjectsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("All");

  // Extract all unique technologies sorted by frequency
  const allTechnologies = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProjects.forEach((p) => {
      p.technologies?.forEach((tech) => {
        counts[tech] = (counts[tech] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech);

    return ["All", ...sorted.slice(0, 8)];
  }, [initialProjects]);

  // Filter projects based on search query and selected technology
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTech =
        selectedTech === "All" ||
        project.technologies?.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      return matchesSearch && matchesTech;
    });
  }, [initialProjects, searchQuery, selectedTech]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedTech("All");
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, technologies, or keywords..."
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Count indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-800 text-xs text-zinc-400 font-medium self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
          <span>
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>

      {/* Tech Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Filter by technology">
        <Filter className="w-4 h-4 text-zinc-500 shrink-0 ml-1 hidden sm:block" />
        {allTechnologies.map((tech) => {
          const isSelected = selectedTech === tech;
          return (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-[#FF6B2C] text-zinc-950 shadow-md shadow-[#FF6B2C]/20"
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {tech}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="popLayout">
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id || project.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <ProjectCard project={project} featured={index === 0 && selectedTech === "All" && !searchQuery} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-xl text-[#FF6B2C]">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white">No projects found</h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              We couldn&apos;t find any projects matching &ldquo;{searchQuery || selectedTech}&rdquo;. Try another keyword or clear the filter.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FF6B2C] text-zinc-950 hover:bg-[#FF7A3D] transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
