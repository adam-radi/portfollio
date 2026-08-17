import type { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: PrismaClientCtor } = require("@prisma/client") as typeof import("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
  };

  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClientCtor({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;
} catch {
  prismaClient = null;
}

export const prisma = prismaClient as PrismaClient;
export default prisma;