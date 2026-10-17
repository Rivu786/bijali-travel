import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { siteOrigin } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const origin = await siteOrigin();
  const [pages, packages] = await Promise.all([
    prisma.pageSeo.findMany({ select: { path: true, updatedAt: true } }),
    prisma.package.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
  ]);
  const updated = new Map(pages.map((page) => [page.path, page.updatedAt]));
  const staticPaths = ["/", "/packages", "/contact", "/payment"];
  return [
    ...staticPaths.map((path) => ({
      url: path === "/" ? origin : `${origin}${path}`,
      lastModified: updated.get(path) ?? new Date(),
    })),
    ...packages.map((pkg) => ({
      url: `${origin}/packages/${pkg.slug}`,
      lastModified: updated.get(`/packages/${pkg.slug}`) ?? pkg.updatedAt,
    })),
  ];
}
