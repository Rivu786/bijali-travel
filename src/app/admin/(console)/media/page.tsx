import Image from "next/image";
import { headers } from "next/headers";
import { deleteMedia } from "@/app/actions/admin";
import { MediaUrl } from "@/components/admin/media-url";
import { prisma } from "@/lib/db";
import { mediaPath } from "@/lib/media";

export const instant = false;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaAdmin({
  searchParams,
}: {
  searchParams: Promise<{ uploaded?: string; skipped?: string; error?: string }>;
}) {
  const query = await searchParams;
  const [rows, headerStore] = await Promise.all([
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    headers(),
  ]);
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const proto = headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Media</h1>
      <p className="mb-6 text-sm text-muted">Upload images, video, or PDFs, then copy the URL into a package field.</p>

      {query.uploaded ? (
        <p className="mb-4 rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm">
          Uploaded {query.uploaded} {query.uploaded === "1" ? "file" : "files"}.
          {query.skipped ? ` ${query.skipped} skipped.` : ""}
        </p>
      ) : null}
      {query.error ? <p className="mb-4 rounded-lg bg-white px-4 py-3 text-sm text-red-700 shadow-sm">{query.error}</p> : null}

      <form
        action="/admin/media/upload"
        method="post"
        encType="multipart/form-data"
        className="mb-6 rounded-xl border border-dashed border-outline/40 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-semibold">
          Files
          <input
            className="mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-cyan file:px-4 file:py-2 file:font-semibold file:text-white"
            type="file"
            name="files"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,application/pdf"
            multiple
            required
          />
        </label>
        <p className="mt-2 text-xs text-muted">Up to 12 files at a time. Each file up to 8 MB.</p>
        <button className="mt-4 rounded-lg bg-cyan px-5 py-2.5 text-sm font-semibold text-white">Upload</button>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-muted shadow-sm">No media yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((item) => {
            const url = `${origin}${mediaPath(item.filename)}`;
            const image = item.mimeType.startsWith("image/");
            return (
              <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex gap-3">
                  {image ? (
                    <Image src={mediaPath(item.filename)} alt="" width={80} height={80} className="size-20 rounded-lg object-cover" unoptimized />
                  ) : (
                    <div className="grid size-20 place-items-center rounded-lg bg-surface-low text-xs font-semibold text-muted">
                      {item.mimeType === "application/pdf" ? "PDF" : "Video"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.originalName}</p>
                    <p className="text-xs text-muted">
                      {formatSize(item.size)} · {item.createdAt.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <MediaUrl url={url} />
                <form action={deleteMedia} className="mt-3">
                  <input type="hidden" name="id" value={item.id} />
                  <button className="text-sm font-semibold text-red-700">Remove</button>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
