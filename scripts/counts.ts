import { PrismaClient } from "@prisma/client";
import { loadProjectEnv } from "../src/lib/load-env";

loadProjectEnv();

const prisma = new PrismaClient();

async function main() {
  const [packages, sections, faqs] = await Promise.all([
    prisma.package.count(),
    prisma.homeSection.count(),
    prisma.faq.count(),
  ]);
  console.log(JSON.stringify({ packages, sections, faqs }));
  await prisma.$disconnect();
}

main();
