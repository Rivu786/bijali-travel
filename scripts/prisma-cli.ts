import { spawnSync } from "child_process";
import { loadProjectEnv } from "../src/lib/load-env";

loadProjectEnv();

if (!process.env.MYSQL_PASSWORD) {
  console.error("Add MYSQL_PASSWORD to the project .env file, then run this again.");
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
