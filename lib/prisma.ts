// lib/prisma.ts


import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL in .env");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "warn", "error"],
  });

declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
