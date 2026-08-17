"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Calendar, User, CheckCircle, Trash2, MailOpen, Loader2 } from "lucide-react";
import { toggleMessageReadAction, deleteMessageAction } from "@/actions/messages";
import type { Message } from "@/types/message";

interface MessageDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<Message | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchMessage() {
      const { id } = await params;
      try {
        const res = await fetch(`/api/dashboard/messages/${id}`);
        if (!res.ok) throw new Error("Failed to fetch message");
        const data = await res.json();
        setMessage(data);
      } catch (err) {
        setError("Failed to load message");
      }
    }
    fetchMessage();
  }, [params]);

  const handleToggleRead = async () => {
    if (!message) return;
    setLoading(true);
    try {
      await toggleMessageReadAction(message.id, message.read);
      router.refresh();
    } catch (err) {
      alert("Failed to update message status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!message || !confirm("Are you sure you want to delete this message?")) return;
    setLoading(true);
    try {
      await deleteMessageAction(message.id);
      router.push("/dashboard/messages");
    } catch (err) {
      alert("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  if (!message && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B2C]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-rose-400">{error}</p>
        <Link href="/dashboard/messages" className="mt-4 inline-flex items-center gap-2 text-[#FF6B2C] hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Messages
        </Link>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="max-w-3xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link
            href="/dashboard/messages"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Messages
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Message Details
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Reply via Email</span>
          </a>
        </div>
      </div>

      {/* Message Card */}
      <div className="p-8 rounded-3xl bg-[#111319] border border-zinc-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{message.subject}</h2>
            <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
              <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                <User className="w-3.5 h-3.5 text-[#FF6B2C]" />
                {message.name}
              </span>
              <span className="text-zinc-500">•</span>
              <a href={`mailto:${message.email}`} className="text-[#FF6B2C] hover:underline">
                {message.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              {new Date(message.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!message.read && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20">
                <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
                Unread
              </span>
            )}
            {message.read && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" />
                Read
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleRead}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/20 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : message.read ? (
                <>
                  <MailOpen className="w-3.5 h-3.5" />
                  <span>Mark Unread</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Message Body</h3>
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>
        </div>
      </div>
    </div>
  );
}