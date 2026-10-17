import { SeoBoard } from "@/components/admin/seo-editor";
import { prisma } from "@/lib/db";
import { mediaPath } from "@/lib/media";
import { listSeoPages } from "@/lib/seo";

export const instant = false;

export default async function SeoAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const [pages, media] = await Promise.all([
    listSeoPages(),
    prisma.mediaAsset.findMany({
      where: { mimeType: { startsWith: "image/" } },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);
  const images = media.map((item) => mediaPath(item.filename));
  const sitePages = pages.filter((page) => page.sortOrder < 100);
  const packagePages = pages.filter((page) => page.sortOrder >= 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO</h1>
        <p className="mt-1 text-sm text-muted">
          Set the meta title, keywords, details, and share image for the home page, tour list, contact, payment, and every package.
        </p>
      </div>
      {query.saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Saved {query.saved}.
        </p>
      ) : null}
      <SeoBoard sitePages={sitePages} packagePages={packagePages} images={images} />
    </div>
  );
}
