import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isProduction = process.env.NODE_ENV === "production";

const connectionString = isProduction
  ? process.env.DATABASE_URL // pooler supabase (porta 6543)
  : process.env.DIRECT_URL; // direct connection (porta 5432)

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
