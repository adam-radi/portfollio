"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FormField from "./FormField";
import FormSection from "./FormSection";
import ImageUpload from "./ImageUpload";
import SubmitButton from "./SubmitButton";
import { createCertificationAction, updateCertificationAction } from "@/actions/certifications";
import { Certification } from "@/types/certification";

interface CertificationFormProps {
  mode: "create" | "edit";
  initialData?: Certification;
}

export function CertificationForm({ mode, initialData }: CertificationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    date: initialData?.date || "",
    expirationDate: initialData?.expirationDate || "",
    credentialId: initialData?.credentialId || "",
    credentialUrl: initialData?.credentialUrl || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        expirationDate: formData.expirationDate || null,
      };

      if (mode === "create") {
        await createCertificationAction(payload);
      } else if (initialData?.id) {
        await updateCertificationAction(initialData.id, payload);
      }

      router.push("/dashboard/certifications");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save certification.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/certifications"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Certifications
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {mode === "create" ? "Add Certification" : `Edit Certification: ${initialData?.title}`}
          </h1>
          <p className="text-xs text-zinc-400">
            Define title, issuer, dates, credential info, description, and certificate image.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/certifications"
            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>
          <SubmitButton
            type="submit"
            loading={loading}
            label={mode === "create" ? "Create Certification" : "Save Changes"}
            className="px-5 py-2.5"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-medium text-rose-400">
          {error}
        </div>
      )}

      <FormSection title="Certification Details" description="Core credential information used on the public site.">
        <FormField label="Certification Title" htmlFor="cert-title" required>
          <input
            id="cert-title"
            type="text"
            required
            placeholder="AWS Certified Solutions Architect"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Issuer" htmlFor="cert-issuer" required>
            <input
              id="cert-issuer"
              type="text"
              required
              placeholder="Amazon Web Services"
              value={formData.issuer}
              onChange={(e) => setFormData((p) => ({ ...p, issuer: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>

          <FormField label="Issue Date" htmlFor="cert-date" required helperText="Use YYYY-MM format">
            <input
              id="cert-date"
              type="month"
              required
              value={formData.date}
              onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Expiration Date" htmlFor="cert-expiration" helperText="Optional">
            <input
              id="cert-expiration"
              type="month"
              value={formData.expirationDate}
              onChange={(e) => setFormData((p) => ({ ...p, expirationDate: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>

          <FormField label="Credential ID" htmlFor="cert-credential-id">
            <input
              id="cert-credential-id"
              type="text"
              placeholder="ABCD-1234"
              value={formData.credentialId}
              onChange={(e) => setFormData((p) => ({ ...p, credentialId: e.target.value }))}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
            />
          </FormField>
        </div>

        <FormField label="Credential URL" htmlFor="cert-url">
          <input
            id="cert-url"
            type="url"
            placeholder="https://coursera.org/verify/..."
            value={formData.credentialUrl}
            onChange={(e) => setFormData((p) => ({ ...p, credentialUrl: e.target.value }))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>

        <FormField label="Description" htmlFor="cert-description">
          <textarea
            id="cert-description"
            rows={3}
            placeholder="Describe what the certification covers or validates."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#FF6B2C] focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />
        </FormField>
      </FormSection>

      <FormSection title="Certificate Image" description="Upload, preview, remove, or replace the certificate visual.">
        <ImageUpload
          label="Certificate Image"
          helperText="Use a local upload or a public image URL."
          value={formData.image}
          onChange={(value) => setFormData((p) => ({ ...p, image: value }))}
        />
      </FormSection>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/dashboard/certifications"
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          Cancel
        </Link>
        <SubmitButton
          type="submit"
          loading={loading}
          label={mode === "create" ? "Create Certification" : "Save Changes"}
          className="px-6 py-3"
        />
      </div>
    </form>
  );
}

export default CertificationForm;
