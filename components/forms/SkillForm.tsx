"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FormField from "./FormField";
import FormSection from "./FormSection";
import SubmitButton from "./SubmitButton";
import { createSkillAction, updateSkillAction } from "@/actions/skills";
import { Skill } from "@/types/skill";

interface SkillFormProps {
  mode: "create" | "edit";
  initialData?: Skill;
}

export function SkillForm({ mode, initialData }: SkillFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "frontend",
    level: initialData?.level || "intermediate",
    icon: initialData?.icon || "",
    description: initialData?.description || "",
    yearsOfExperience: String(initialData?.yearsOfExperience ?? 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        yearsOfExperience: Number(formData.yearsOfExperience || 0),
      };

      if (mode === "create") {
        await createSkillAction(payload);
      } else if (initialData?.id) {
        await updateSkillAction(initialData.id, payload);
      }

      router.push("/dashboard/skills");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save skill.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/skills"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Skills
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {mode === "create" ? "Add Technical Skill" : `Edit Skill: ${initialData?.name}`}
          </h1>
          <p className="text-xs text-zinc-400">
            Define skill name, category, proficiency level, icon, description, and years of experience.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/skills"
            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>
          <SubmitButton
            type="submit"
            loading={loading}
            label={mode === "create" ? "Create Skill" : "Save Changes"}
            className="px-5 py-2.5"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-medium text-rose-400">
          {error}
        </div>
      )}

      <FormSection title="Skill Details" description="Core skill metadata used in the Skills section.">
        <FormField label="Skill Name" htmlFor="skill-name" required>
          <input
            id="skill-name"
            type="text"
            required
            placeholder="React / Next.js / Exocad"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Category" htmlFor="skill-category" required>
            <select
              id="skill-category"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
              <option value="tools">Tools</option>
              <option value="dental">Dental Technologies</option>
            </select>
          </FormField>

          <FormField label="Level" htmlFor="skill-level" required>
            <select
              id="skill-level"
              value={formData.level}
              onChange={(e) => setFormData((p) => ({ ...p, level: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Icon" htmlFor="skill-icon">
            <input
              id="skill-icon"
              type="text"
              placeholder="⚡ / 🛠 / 🦷"
              value={formData.icon}
              onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>

          <FormField label="Years of Experience" htmlFor="skill-years">
            <input
              id="skill-years"
              type="number"
              min="0"
              step="0.5"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData((p) => ({ ...p, yearsOfExperience: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="skill-description">
          <textarea
            id="skill-description"
            rows={3}
            placeholder="Short explanation of how/where you use this skill."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>
      </FormSection>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/dashboard/skills"
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          Cancel
        </Link>
        <SubmitButton
          type="submit"
          loading={loading}
          label={mode === "create" ? "Create Skill" : "Save Changes"}
          className="px-6 py-3"
        />
      </div>
    </form>
  );
}

export default SkillForm;
