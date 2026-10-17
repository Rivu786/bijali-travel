import { Prisma, PrismaClient } from "@prisma/client";
import { loadProjectEnv } from "@/lib/load-env";

loadProjectEnv();

type Db = ReturnType<typeof queuedClient>;

const globalForPrisma = globalThis as unknown as { prisma?: Db; prismaUrl?: string };
const databaseUrl = process.env.DATABASE_URL;

function matchesGeneratedClient(client: PrismaClient) {
  return Object.values(Prisma.ModelName).every((model) => {
    const delegate = model.charAt(0).toLowerCase() + model.slice(1);
    return delegate in client;
  });
}

const cached = globalForPrisma.prisma;
const reusable = cached && globalForPrisma.prismaUrl === databaseUrl && matchesGeneratedClient(cached as PrismaClient);

if (cached && !reusable) {
  void cached.$disconnect();
}

function queuedClient() {
  const base = new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  let tail: Promise<void> = Promise.resolve();
  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const previous = tail;
          let release: () => void = () => undefined;
          tail = new Promise<void>((resolve) => {
            release = resolve;
          });
          await previous;
          try {
            return await query(args);
          } finally {
            release();
          }
        },
      },
    },
  });
}

export const prisma: Db = cached && reusable ? cached : queuedClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaUrl = databaseUrl;
}
