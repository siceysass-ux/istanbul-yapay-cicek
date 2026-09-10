import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  // Build sırasında DATABASE_URL yoksa dummy client oluştur (query yapılmaz)
  const url = process.env.DATABASE_URL || "file:./dev.db";
  try {
    return new PrismaClient({
      log: ["error"],
      datasources: { db: { url } },
    });
  } catch {
    return new PrismaClient({ log: ["error"] });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
