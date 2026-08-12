import React from "react";
import { getMessages } from "@/lib/db/data-fetchers";
import MessagesTable from "@/components/dashboard/MessagesTable";

export default async function DashboardMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B2C]">
          Inbox
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
          Messages{messages.length > 0 ? ` (${messages.length})` : ""}
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Contact form submissions from the public portfolio.
        </p>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  );
}
