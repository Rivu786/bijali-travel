import { spawnSync } from "child_process";
import { loadProjectEnv } from "../src/lib/load-env";

loadProjectEnv();

const client = "C:\\Program Files\\MariaDB 13.0\\bin\\mysql.exe";
const result = spawnSync(
  client,
  [
    "-h",
    process.env.MYSQL_HOST ?? "",
    "-P",
    process.env.MYSQL_PORT || "3306",
    "-u",
    process.env.MYSQL_USER ?? "",
    "--protocol=TCP",
    "-e",
    "SELECT 1 AS ok",
    process.env.MYSQL_DATABASE ?? "",
  ],
  {
    env: { ...process.env, MYSQL_PWD: process.env.MYSQL_PASSWORD ?? "" },
    encoding: "utf8",
  },
);

const secret = process.env.MYSQL_PASSWORD ?? "";
const hide = (text: string) => (secret ? text.split(secret).join("[hidden]") : text);
console.log("status", result.status);
console.log(hide(result.stdout || ""));
console.error(hide(result.stderr || result.error?.message || ""));
