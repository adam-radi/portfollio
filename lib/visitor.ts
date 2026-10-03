import { cookies } from "next/headers";
import crypto from "crypto";

export const VISITOR_COOKIE = "visitor_id";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const VISITOR_PATTERN = /^[a-f0-9]{32}$/;

export function isValidVisitorId(value: string): boolean {
  return VISITOR_PATTERN.test(value);
}

/**
 * Anonymous visitor identifier used to keep likes unique per browser.
 *
 * - Random value generated server-side (never exposed to the UI).
 * - Stored in an httpOnly cookie so the client cannot forge or read it.
 * - Read only from the cookie store — never trusted from request payloads.
 */
export async function getOrCreateVisitorId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;

  if (existing && isValidVisitorId(existing)) return existing;

  const visitorId = crypto.randomBytes(16).toString("hex");
  cookieStore.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_MAX_AGE,
  });

  return visitorId;
}
