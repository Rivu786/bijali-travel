import { PrismaClient } from "@prisma/client";
import { loadProjectEnv } from "../src/lib/load-env";

loadProjectEnv();

const prisma = new PrismaClient();

async function main() {
  const started = Date.now();
  try {
    const rows = await prisma.pageSeo.findMany({
      select: { path: true, metaTitle: true },
      orderBy: { sortOrder: "asc" },
    });
    const packages = await prisma.package.count();
    console.log(JSON.stringify({ count: rows.length, packages, ms: Date.now() - started, paths: rows.map((row) => row.path) }));
  } catch (error) {
    const secret = process.env.MYSQL_PASSWORD ?? "";
    const message = error instanceof Error ? error.message : "failed";
    console.log(secret ? message.split(secret).join("[hidden]") : message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
