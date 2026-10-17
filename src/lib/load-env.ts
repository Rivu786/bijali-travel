import fs from "fs";
import path from "path";

export function loadProjectEnv() {
  const file = path.join(process.cwd(), ".env");
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key) process.env[key] = value;
    }
  }

  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD) return;

  const user = encodeURIComponent(process.env.MYSQL_USER);
  const password = encodeURIComponent(process.env.MYSQL_PASSWORD ?? "");
  const database = encodeURIComponent(process.env.MYSQL_DATABASE ?? "");
  const port = process.env.MYSQL_PORT || "3306";
  process.env.DATABASE_URL = `mysql://${user}:${password}@${process.env.MYSQL_HOST}:${port}/${database}?connection_limit=2&pool_timeout=60`;
}
