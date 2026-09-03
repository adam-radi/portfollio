import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const clientKey = `login:${getClientKey(request)}`;
    if (isRateLimited(clientKey, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    const input = usernameOrEmail.trim();

    const envAdminUser = process.env.ADMIN_USERNAME || (process.env.NODE_ENV === "production" ? "" : "adamradi");
    const envAdminEmail =
      process.env.ADMIN_EMAIL || (process.env.NODE_ENV === "production" ? "" : "radi.adam.2006@gmail.com");
    const envAdminPass = process.env.ADMIN_PASSWORD || "";

    let sessionData = null;

    if (
      envAdminPass &&
      (input === envAdminUser || input === envAdminEmail) &&
      verifyPassword(password, envAdminPass)
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
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Create session token and set HTTP-only cookie
    const token = await createSessionToken(sessionData);
    await setSessionCookie(token);

    return NextResponse.json(
      { success: true, redirectUrl: "/dashboard" },
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
