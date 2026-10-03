import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { validateReview, ReviewInput } from "@/lib/review-validation";

const SUCCESS_MESSAGE =
  "Thank you. Your review has been submitted and is awaiting moderation.";

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20_000) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const clientKey = `review:${getClientKey(request)}`;
    if (isRateLimited(clientKey, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body: ReviewInput = await request.json();

    // Honeypot — bots fill hidden fields; accept silently without storing.
    if (String(body.honeypot || "").trim() !== "") {
      return NextResponse.json({ success: true, message: SUCCESS_MESSAGE }, { status: 200 });
    }

    // Server-side validation (same rules as the client form)
    const result = validateReview(body);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields.", errors: result.errors },
        { status: 400 }
      );
    }

    const data = result.data;

    if (!process.env.DATABASE_URL || !prisma?.review) {
      return NextResponse.json({ error: "Database is not available." }, { status: 503 });
    }

    // Duplicate submission protection: same person + same text in the last 24h.
    const duplicate = await prisma.review.findFirst({
      where: {
        name: data.name,
        content: data.content,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ success: true, message: SUCCESS_MESSAGE }, { status: 200 });
    }

    // New reviews always start as PENDING — never auto-approved.
    await prisma.review.create({
      data: {
        name: data.name,
        role: data.role,
        company: data.company,
        content: data.content,
        rating: data.rating,
        linkedinUrl: data.linkedinUrl,
        websiteUrl: data.websiteUrl,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/reviews");

    return NextResponse.json({ success: true, message: SUCCESS_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
