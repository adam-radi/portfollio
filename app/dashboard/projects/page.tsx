import React from "react";
import ProjectTable from "@/components/dashboard/ProjectTable";
import { getProjects } from "@/lib/db/data-fetchers";

export default async function DashboardProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B2C]">
          Content Management
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Projects ({projects.length})
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Create, edit, and manage projects. Mutations update both MySQL database and public portfolio pages.
        </p>
      </div>

      <ProjectTable initialProjects={projects} />
    </div>
  );
}
