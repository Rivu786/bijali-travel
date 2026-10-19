import { readFile } from "fs/promises";
import path from "path";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { mediaDir } from "@/lib/media";

export const instant = false;

export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  await connection();
  const filename = path.basename((await context.params).filename);
  const row = await prisma.mediaAsset.findUnique({ where: { filename } });
  if (!row) return new Response("Not found", { status: 404 });

  const bytes = row.bytes?.byteLength
    ? row.bytes
    : await readFile(path.join(mediaDir(), filename)).catch(() => null);
  if (!bytes) return new Response("Not found", { status: 404 });

  const body = Buffer.from(bytes);
  return new Response(body, {
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
