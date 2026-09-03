"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function toggleMessageReadAction(id: string, currentRead: boolean) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.message) {
    throw new Error("Database not connected.");
  }

  await prisma.message.update({
    where: { id },
    data: { read: !currentRead },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
}

export async function deleteMessageAction(id: string) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.message) {
    throw new Error("Database not connected.");
  }

  await prisma.message.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
}
