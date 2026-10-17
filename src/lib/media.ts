import { randomBytes } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 12;

const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

const typeAliases: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
  "application/x-pdf": "application/pdf",
};

export function mediaDir() {
  return path.join(process.cwd(), "public", "media");
}

export function mediaPath(filename: string) {
  return `/media/${filename}`;
}

export class MediaError extends Error {}

function acceptedType(file: File, mime: string) {
  if (!file.type || file.type === "application/octet-stream") return true;
  return file.type === mime || typeAliases[file.type] === mime;
}

export async function saveMediaFile(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  const mime = types[ext];
  if (!mime || !acceptedType(file, mime)) {
    throw new MediaError("Use a JPG, PNG, WebP, GIF, AVIF, MP4, WebM, or PDF file.");
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    throw new MediaError("Each file must be under 8 MB.");
  }

  const filename = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const saved = await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: file.name.slice(0, 255) || filename,
      mimeType: mime,
      size: file.size,
      bytes,
    },
  });
  await mkdir(mediaDir(), { recursive: true }).catch(() => undefined);
  await writeFile(path.join(mediaDir(), filename), bytes).catch(() => undefined);
  return saved;
}

export async function saveMediaFiles(files: File[]) {
  const incoming = files.filter((file) => file.size > 0).slice(0, MAX_FILES);
  if (!incoming.length) throw new MediaError("Choose at least one file.");
  const saved = [];
  const skipped: string[] = [];
  let reason = "None of those files could be uploaded. Check the type and keep each under 8 MB.";
  for (const file of incoming) {
    try {
      saved.push(await saveMediaFile(file));
    } catch (error) {
      skipped.push(file.name || "file");
      reason = error instanceof MediaError ? error.message : "The file could not be saved. Use a JPG, PNG, or WebP under 8 MB.";
    }
  }
  if (!saved.length) throw new MediaError(reason);
  return { saved, skipped };
}

export async function deleteMediaFile(id: number) {
  const row = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!row) return;
  const filename = path.basename(row.filename);
  await unlink(path.join(mediaDir(), filename)).catch(() => undefined);
  await prisma.mediaAsset.delete({ where: { id } });
}
