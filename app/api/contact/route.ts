import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const body: ContactRequestBody = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // 1. Honeypot anti-spam (silent reject)
    if (honeypot && honeypot.trim() !== "") {
      return NextResponse.json(
        { success: true, message: "Message sent successfully." },
        { status: 200 }
      );
    }

    // 2. Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!subject || subject.trim().length < 3) {
      return NextResponse.json({ error: "Subject must be at least 3 characters." }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    // 3. Persist to DB if available
    if (process.env.DATABASE_URL && prisma?.message) {
      await prisma.message.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          read: false,
        },
      });
    } else {
      // Fallback: log to server console until DB is configured
      console.info("[Contact Form Submission]", {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
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
