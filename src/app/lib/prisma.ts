import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isProduction = process.env.NODE_ENV === "production";

const connectionString = isProduction
  ? process.env.DIRECT_URL // pooler supabase
  : process.env.DATABASE_URL; // normal

if (!connectionString) {
  throw new Error("Missing DATABASE_URL / DIRECT_URL environment variables");
}

// Create adapter with the correct URL depending on environment
const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
