import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20_000) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const clientKey = `contact:${getClientKey(request)}`;
    if (isRateLimited(clientKey, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    const body: ContactRequestBody = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const honeypot = String(body.honeypot || "").trim();

    // 1. Honeypot anti-spam (silent reject)
    if (honeypot !== "") {
      return NextResponse.json(
        { success: true, message: "Message sent successfully." },
        { status: 200 }
      );
    }

    // 2. Server-side validation
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    if (!email || email.length > 120 || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (subject.length < 3 || subject.length > 140) {
      return NextResponse.json({ error: "Subject must be at least 3 characters." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 5_000) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    // 3. Persist to DB if available
    if (process.env.DATABASE_URL && prisma?.message) {
      await prisma.message.create({
        data: {
          name: name.trim(),
          email,
          subject,
          message,
          read: false,
        },
      });
    } else {
      // Fallback: log to server console until DB is configured
      console.info("[Contact Form Submission]", {
        name: name.trim(),
        email,
        subject,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: true, message: "Thank you! Your message has been received." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
