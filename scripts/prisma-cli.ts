import { spawnSync } from "child_process";
import { loadProjectEnv } from "../src/lib/load-env";

loadProjectEnv();

const args = process.argv.slice(2);
if (!process.env.DATABASE_URL && args[0] === "generate") {
  process.env.DATABASE_URL = "mysql://build:build@127.0.0.1:3306/bijali";
}

if (!process.env.DATABASE_URL) {
  console.error("Add MYSQL_PASSWORD to the project .env file, then run this again.");
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", ...args], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
