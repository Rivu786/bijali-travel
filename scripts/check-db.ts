import { PrismaClient } from "@prisma/client";
import { loadProjectEnv } from "../src/lib/load-env";

loadProjectEnv();

const prisma = new PrismaClient();

prisma
  .$queryRawUnsafe("SELECT 1 AS ok")
  .then(() => {
    console.log("connected");
  })
  .catch((error: { message?: string }) => {
    const secret = process.env.MYSQL_PASSWORD ?? "";
    const message = error.message ?? "connection failed";
    console.error(secret ? message.split(secret).join("[hidden]") : message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
