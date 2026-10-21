import { PrismaClient } from "@prisma/client";
import { existsSync, mkdirSync, copyFileSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const DB_SEED_VERSION = "eos-camera-v2";

function ensurePersistentSqliteDb(url: string) {
  if (!url.startsWith("file:/")) return;
  const targetPath = url.slice("file:".length);
  try {
    const markerPath = join(dirname(targetPath), `.seed-${DB_SEED_VERSION}`);
    const needsSeed =
      !existsSync(targetPath) ||
      statSync(targetPath).size < 4096 ||
      !existsSync(markerPath);
    if (!needsSeed) return;
    const candidates = [
      join(process.cwd(), "prisma", "dev.db"),
      join(process.cwd(), "..", "..", "prisma", "dev.db"),
    ];
    const seedDb = candidates.find((p) => existsSync(p) && statSync(p).size >= 4096);
    if (seedDb) {
      mkdirSync(dirname(targetPath), { recursive: true });
      copyFileSync(seedDb, targetPath);
      writeFileSync(markerPath, new Date().toISOString(), "utf8");
    }
  } catch {
    // Ignore FS errors on read-only environments
  }
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  ensurePersistentSqliteDb(url);

  return new PrismaClient({
    log: ["error"],
    datasources: { db: { url } },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
