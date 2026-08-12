"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FormField from "./FormField";
import FormSection from "./FormSection";
import DynamicList from "./DynamicList";
import ImageUpload from "./ImageUpload";
import SubmitButton from "./SubmitButton";
import { createProjectAction, updateProjectAction } from "@/actions/projects";
import { Project } from "@/types/project";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project;
}

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    overview: initialData?.overview || "",
    problem: initialData?.problem || "",
    solution: initialData?.solution || "",
    image: initialData?.image || "/images/projects/placeholder.png",
    githubUrl: initialData?.githubUrl || "",
    liveUrl: initialData?.liveUrl || "",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
  });

  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || []);
  const [challenges, setChallenges] = useState<string[]>(initialData?.challenges || []);
  const [lessonsLearned, setLessonsLearned] = useState<string[]>(initialData?.lessonsLearned || []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generatedSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        features: features.filter((item) => item.trim() !== ""),
        technologies: technologies.filter((item) => item.trim() !== ""),
        challenges: challenges.filter((item) => item.trim() !== ""),
        lessonsLearned: lessonsLearned.filter((item) => item.trim() !== ""),
      };

      if (mode === "create") {
        await createProjectAction(payload);
      } else if (initialData?.id) {
        await updateProjectAction(initialData.id, payload);
      }

      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {mode === "create" ? "Add New Project" : `Edit Project: ${initialData?.title}`}
          </h1>
          <p className="text-xs text-zinc-400">
            Fill in the project specifications. Changes update MySQL and the public portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>
          <SubmitButton
            type="submit"
            loading={loading}
            label={mode === "create" ? "Create Project" : "Save Changes"}
            className="px-5 py-2.5"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-medium text-rose-400">
          {error}
        </div>
      )}

      <FormSection
        title="Basic Information"
        description="Core public fields used on project cards and detail pages."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Project Title" htmlFor="project-title" required>
            <input
              id="project-title"
              type="text"
              required
              placeholder="e.g. AgriFlow"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>

          <FormField
            label="URL Slug"
            htmlFor="project-slug"
            required
            helperText="Unique URL identifier for the project details page"
          >
            <input
              id="project-slug"
              type="text"
              required
              placeholder="agriflow"
              value={formData.slug}
              onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>
        </div>

        <FormField label="Short Summary Description" htmlFor="project-desc" required>
          <textarea
            id="project-desc"
            rows={2}
            required
            placeholder="A full-stack agricultural marketplace..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Case Study"
        description="Deeper context used on the project detail page."
      >
        <FormField label="Overview" htmlFor="project-overview">
          <textarea
            id="project-overview"
            rows={3}
            placeholder="Comprehensive overview of the application goals and vision..."
            value={formData.overview}
            onChange={(e) => setFormData((p) => ({ ...p, overview: e.target.value }))}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="The Problem Statement" htmlFor="project-problem">
            <textarea
              id="project-problem"
              rows={3}
              placeholder="What specific problem did this project address?"
              value={formData.problem}
              onChange={(e) => setFormData((p) => ({ ...p, problem: e.target.value }))}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>

          <FormField label="The Solution & Architecture" htmlFor="project-solution">
            <textarea
              id="project-solution"
              rows={3}
              placeholder="How does your architecture solve the problem?"
              value={formData.solution}
              onChange={(e) => setFormData((p) => ({ ...p, solution: e.target.value }))}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Tech Stack & Features"
        description="All array-based content is editable from the same form."
      >
        <DynamicList
          label="Technologies & Frameworks"
          items={technologies}
          onChange={setTechnologies}
          placeholder="e.g. React, Next.js, TypeScript, Laravel..."
        />

        <DynamicList
          label="Key Features & Functionalities"
          items={features}
          onChange={setFeatures}
          placeholder="e.g. Role-based authentication via Laravel Sanctum..."
        />

        <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
          <DynamicList
            label="Technical Challenges"
            items={challenges}
            onChange={setChallenges}
            placeholder="e.g. Designing real-time stock sync..."
          />

          <DynamicList
            label="Lessons Learned"
            items={lessonsLearned}
            onChange={setLessonsLearned}
            placeholder="e.g. Clean architecture improves testability..."
          />
        </div>
      </FormSection>

      <FormSection
        title="Media & Links"
        description="Image upload supports preview, replace and remove."
      >
        <ImageUpload
          label="Main Showcase Image"
          helperText="Upload a project hero image or paste a public URL."
          value={formData.image}
          onChange={(value) => setFormData((p) => ({ ...p, image: value }))}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="GitHub Repository URL" htmlFor="project-github">
            <input
              id="project-github"
              type="url"
              placeholder="https://github.com/adam-radi/agriflow"
              value={formData.githubUrl}
              onChange={(e) => setFormData((p) => ({ ...p, githubUrl: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>

          <FormField label="Live Demo URL" htmlFor="project-live">
            <input
              id="project-live"
              type="url"
              placeholder="https://example.com"
              value={formData.liveUrl}
              onChange={(e) => setFormData((p) => ({ ...p, liveUrl: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Visibility Settings" description="Control how the project appears on the public site.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-xs font-semibold text-zinc-200">
            <input
              id="project-featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
              className="h-4 w-4 rounded border-zinc-700 text-[#FF6B2C] focus:ring-[#FF6B2C]"
            />
            <span>Mark as Featured Project</span>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-xs font-semibold text-zinc-200">
            <input
              id="project-published"
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
              className="h-4 w-4 rounded border-zinc-700 text-[#FF6B2C] focus:ring-[#FF6B2C]"
            />
            <span>Published on public portfolio</span>
          </label>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/dashboard/projects"
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          Cancel
        </Link>
        <SubmitButton
          type="submit"
          loading={loading}
          label={mode === "create" ? "Create Project" : "Save Changes"}
          className="px-6 py-3"
        />
      </div>
    </form>
  );
}

export default ProjectForm;
