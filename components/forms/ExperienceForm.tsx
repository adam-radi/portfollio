"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import FormField from "./FormField";
import DynamicList from "./DynamicList";
import { createExperienceAction, updateExperienceAction } from "@/actions/experience";
import { Experience } from "@/types/experience";

interface ExperienceFormProps {
  mode: "create" | "edit";
  initialData?: Experience;
}

export function ExperienceForm({ mode, initialData }: ExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company: initialData?.company || "",
    role: initialData?.role || "",
    location: initialData?.location || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    current: initialData?.current || false,
    companyLogo: initialData?.companyLogo || "",
  });

  const [description, setDescription] = useState<string[]>(initialData?.description || []);
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        description: description.filter((d) => d.trim() !== ""),
        technologies: technologies.filter((t) => t.trim() !== ""),
      };

      if (mode === "create") {
        await createExperienceAction(payload);
      } else if (initialData?.id) {
        await updateExperienceAction(initialData.id, payload);
      }

      router.push("/dashboard/experience");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save experience.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link
            href="/dashboard/experience"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Experience
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {mode === "create" ? "Add Work Experience" : `Edit Experience: ${initialData?.role}`}
          </h1>
          <p className="text-xs text-zinc-400">
            Define company, role, dates, and responsibilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/experience"
            className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{mode === "create" ? "Create Experience" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
        <h2 className="text-sm font-bold text-[#FF6B2C] uppercase tracking-wider">Company & Role Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Company Name" htmlFor="exp-company" required>
            <input
              id="exp-company"
              type="text"
              required
              placeholder="Smile Clinic"
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-[#FF6B2C]"
            />
          </FormField>

          <FormField label="Position / Role Title" htmlFor="exp-role" required>
            <input
              id="exp-role"
              type="text"
              required
              placeholder="IT Support & CAD Dental Technician"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-[#FF6B2C]"
            />
          </FormField>
        </div>

        <FormField label="Location" htmlFor="exp-location" required>
          <input
            id="exp-location"
            type="text"
            required
            placeholder="Maroc"
            value={formData.location}
            onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-[#FF6B2C]"
          />
        </FormField>

        <FormField label="Company Logo (URL/Path)" htmlFor="exp-logo">
          <input
            id="exp-logo"
            type="text"
            placeholder="/images/companies/smile-clinic.png"
            value={formData.companyLogo}
            onChange={(e) => setFormData((p) => ({ ...p, companyLogo: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-[#FF6B2C]"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Start Date" htmlFor="exp-start" required helperText="Format: YYYY-MM">
            <input
              id="exp-start"
              type="text"
              required
              placeholder="2023-01"
              value={formData.startDate}
              onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-[#FF6B2C]"
            />
          </FormField>

          {!formData.current && (
            <FormField label="End Date" htmlFor="exp-end" helperText="Format: YYYY-MM">
              <input
                id="exp-end"
                type="text"
                placeholder="2024-06"
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-[#FF6B2C]"
              />
            </FormField>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
          <input
            id="exp-current"
            type="checkbox"
            checked={formData.current}
            onChange={(e) => setFormData((p) => ({ ...p, current: e.target.checked }))}
            className="w-4 h-4 rounded border-zinc-700 text-[#FF6B2C] focus:ring-[#FF6B2C]"
          />
          <label htmlFor="exp-current" className="text-xs font-semibold text-zinc-200 cursor-pointer">
            Current Position (Present)
          </label>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
        <h2 className="text-sm font-bold text-[#FF6B2C] uppercase tracking-wider">Responsibilities & Tech Stack</h2>

        <DynamicList
          label="Responsibilities / Key Bullet Points"
          items={description}
          onChange={setDescription}
          placeholder="e.g. IT support & workstation setup..."
        />

        <DynamicList
          label="Technologies & Tools Used"
          items={technologies}
          onChange={setTechnologies}
          placeholder="e.g. Exocad, Windows Server, Networking..."
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/dashboard/experience"
          className="px-5 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{mode === "create" ? "Create Experience" : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

export default ExperienceForm;
