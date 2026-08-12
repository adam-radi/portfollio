import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth";

export async function POST() {
  await removeSessionCookie();
  return NextResponse.json(
    { success: true, redirectUrl: "/login" },
    { status: 200 }
  );
}

export async function GET(request: Request) {
  await removeSessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
