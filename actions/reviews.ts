"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { ReviewStatus } from "@/types/review";

function revalidateReviewRoutes() {
  // Approved reviews are rendered on the public homepage.
  revalidatePath("/");
  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard");
}

export async function setReviewStatusAction(id: string, status: ReviewStatus) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.review) {
    throw new Error("Database not connected.");
  }

  if (status !== "PENDING" && status !== "APPROVED" && status !== "REJECTED") {
    return { success: false, error: "Invalid status." };
  }

  try {
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Review not found." };

    await prisma.review.update({ where: { id }, data: { status } });
    revalidateReviewRoutes();
    return { success: true };
  } catch (error) {
    console.error("setReviewStatusAction error:", error);
    return { success: false, error: "Failed to update review status." };
  }
}

export async function deleteReviewAction(id: string) {
  await requireAdminSession();

  if (!process.env.DATABASE_URL || !prisma?.review) {
    throw new Error("Database not connected.");
  }

  try {
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Review not found." };

    await prisma.review.delete({ where: { id } });
    revalidateReviewRoutes();
    return { success: true };
  } catch (error) {
    console.error("deleteReviewAction error:", error);
    return { success: false, error: "Failed to delete review." };
  }
}
