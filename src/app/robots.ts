import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteOrigin } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const origin = await siteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
