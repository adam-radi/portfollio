let prismaClient: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma: any;
  };

  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;
} catch {
  prismaClient = null;
}

export const prisma = prismaClient;
export default prisma;
