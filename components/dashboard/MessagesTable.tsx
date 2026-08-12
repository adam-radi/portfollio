"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, CheckCircle, Eye } from "lucide-react";
import { Message } from "@/types/message";
import { deleteMessageAction, toggleMessageReadAction } from "@/actions/messages";

interface MessagesTableProps {
  initialMessages: Message[];
}

export default function MessagesTable({ initialMessages }: MessagesTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleToggle = async (message: Message) => {
    setPendingId(message.id);
    try {
      await toggleMessageReadAction(message.id, message.read);
      router.refresh();
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (message: Message) => {
    if (!window.confirm("Are you sure?")) return;
    setPendingId(message.id);
    try {
      await deleteMessageAction(message.id);
      router.refresh();
    } finally {
      setPendingId(null);
    }
  };

  if (initialMessages.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800/80 bg-[#111319] p-6">
        <div className="py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-[#FF6B2C]">
            <Mail className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-white">No Messages Yet</p>
          <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500">
            Messages sent via the contact form will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl border border-zinc-800/80 bg-[#111319] p-6">
      {initialMessages.map((msg) => (
        <article
          key={msg.id}
          className={`space-y-3 rounded-2xl border p-4 transition-all ${
            msg.read ? "border-zinc-800/50 bg-zinc-950/40" : "border-[#FF6B2C]/20 bg-[#FF6B2C]/5"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                {!msg.read && <span className="h-2 w-2 rounded-full bg-[#FF6B2C]" aria-hidden="true" />}
                <Link
                  href={`/dashboard/messages/${msg.id}`}
                  className="block truncate text-sm font-bold text-white transition-colors hover:text-[#FF6B2C]"
                >
                  {msg.subject}
                </Link>
              </div>
              <p className="text-xs text-zinc-400">
                From: <span className="font-medium text-zinc-300">{msg.name}</span>{" "}
                <span className="text-zinc-600">·</span>{" "}
                <a href={`mailto:${msg.email}`} className="text-[#FF6B2C] hover:underline">
                  {msg.email}
                </a>
              </p>
            </div>
            <span className="shrink-0 text-[10px] text-zinc-500">
              {new Date(msg.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <p className="line-clamp-3 text-xs leading-relaxed text-zinc-400">{msg.message}</p>

          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/50 pt-3">
            <Link
              href={`/dashboard/messages/${msg.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </Link>

            <button
              type="button"
              onClick={() => handleToggle(msg)}
              disabled={pendingId === msg.id}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                msg.read
                  ? "text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                  : "text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
              }`}
            >
              {msg.read ? (
                <>
                  <MailOpen className="h-3.5 w-3.5" />
                  <span>Mark Unread</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Mark Read</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleDelete(msg)}
              disabled={pendingId === msg.id}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
