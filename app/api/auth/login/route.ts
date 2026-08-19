import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    const input = usernameOrEmail.trim();

    // 1. Fallback / Environment Admin credentials check
    const envAdminUser = process.env.ADMIN_USERNAME || "adamradi";
    const envAdminEmail = process.env.ADMIN_EMAIL || "radi.adam.2006@gmail.com";
    const envAdminPass = process.env.ADMIN_PASSWORD || "AdamRadi2026!";

    let sessionData = null;

    if (
      (input === envAdminUser || input === envAdminEmail) &&
      password === envAdminPass
    ) {
      sessionData = {
        userId: "admin-env",
        email: envAdminEmail,
        username: envAdminUser,
        role: "ADMIN",
      };
    } else if (process.env.DATABASE_URL && prisma?.user) {
      // 2. Query Database User if configured
      let bcrypt: typeof import("bcryptjs") | null = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        bcrypt = require("bcryptjs");
      } catch {
        bcrypt = null;
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: input }, { username: input }],
        },
      });

      if (user) {
        let isValid = false;
        if (bcrypt) {
          isValid = await bcrypt.compare(password, user.password);
        } else {
          isValid = password === envAdminPass || password === user.password;
        }

        if (isValid) {
          sessionData = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          };
        }
      }
    }

    if (!sessionData) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your username and password." },
        { status: 401 }
      );
    }

    // Create session token and set HTTP-only cookie
    const token = await createSessionToken(sessionData);
    await setSessionCookie(token);

    return NextResponse.json(
      { success: true, user: sessionData, redirectUrl: "/dashboard" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
