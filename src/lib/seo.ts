import type { Metadata } from "next";
import { headers } from "next/headers";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { mediaSrc } from "@/lib/media-path";

export type SeoDraft = {
  path: string;
  label: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  ogImage: string;
  sortOrder: number;
  packageId?: number | null;
};

type PackageSeo = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
};

export async function siteOrigin() {
  const configured = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  const h = await headers();
  const forwarded = h.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwarded || h.get("host") || "localhost:3000";
  const proto =
    h.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

function absoluteUrl(origin: string, value: string) {
  const src = mediaSrc(value).trim();
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${origin}${src.startsWith("/") ? src : `/${src}`}`;
}

export async function seoMetadata(
  row: Pick<SeoDraft, "path" | "metaTitle" | "metaKeywords" | "metaDescription" | "ogImage">,
  siteName: string,
): Promise<Metadata> {
  const origin = await siteOrigin();
  const image = row.ogImage ? absoluteUrl(origin, row.ogImage) : "";
  const pageUrl = `${origin}${row.path === "/" ? "" : row.path}`;
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: row.metaTitle }]
    : undefined;

  return {
    title: { absolute: row.metaTitle },
    description: row.metaDescription,
    keywords: row.metaKeywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: row.metaTitle,
      description: row.metaDescription,
      url: pageUrl,
      siteName,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: row.metaTitle,
      description: row.metaDescription,
      images: image ? [image] : undefined,
    },
  };
}

async function brandName() {
  const site = await prisma.siteSetting.findUnique({ where: { id: 1 }, select: { brandName: true } });
  return site?.brandName || "Bijali Tours & Travels";
}

export async function pageMetadata(path: string, fallback: Omit<SeoDraft, "path">) {
  await connection();
  const [row, siteName] = await Promise.all([
    prisma.pageSeo.findUnique({ where: { path } }),
    brandName(),
  ]);
  return seoMetadata(row ?? { path, ...fallback }, siteName);
}

function packageDraft(pkg: PackageSeo): SeoDraft {
  return {
    path: `/packages/${pkg.slug}`,
    label: pkg.title,
    metaTitle: `${pkg.title} · Bijali Tours & Travels`.slice(0, 255),
    metaKeywords: `${pkg.title}, tour package, Bijali Tours & Travels`,
    metaDescription: pkg.summary,
    ogImage: pkg.imageUrl,
    sortOrder: 100,
    packageId: pkg.id,
  };
}

export async function syncPackageSeo(pkg: PackageSeo) {
  const draft = packageDraft(pkg);
  const existing = await prisma.pageSeo.findUnique({ where: { packageId: pkg.id } });
  if (existing) {
    if (existing.path !== draft.path || existing.label !== draft.label) {
      await prisma.pageSeo.update({
        where: { id: existing.id },
        data: { path: draft.path, label: draft.label },
      });
    }
    return;
  }
  const byPath = await prisma.pageSeo.findUnique({ where: { path: draft.path } });
  if (byPath) {
    await prisma.pageSeo.update({
      where: { id: byPath.id },
      data: { packageId: pkg.id, label: draft.label },
    });
    return;
  }
  await prisma.pageSeo.create({ data: draft });
}

export async function ensureSeoCatalog() {
  const [settings, packages] = await Promise.all([
    prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.package.findMany({
      orderBy: { title: "asc" },
      select: { id: true, slug: true, title: true, summary: true, imageUrl: true },
    }),
  ]);
  const staticPages: SeoDraft[] = [
    {
      path: "/",
      label: "Home",
      metaTitle: settings.brandName,
      metaKeywords: "Bijali Tours, tour packages, domestic tours, international tours, weekend getaways",
      metaDescription: settings.heroSubtitle,
      ogImage: settings.heroImage || settings.logoUrl,
      sortOrder: 0,
    },
    {
      path: "/packages",
      label: "Tour packages",
      metaTitle: `Tour Packages · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "tour packages, domestic holidays, international tours, weekend trips, Bijali Tours",
      metaDescription: `Explore curated national and international tour packages from ${settings.brandName}.`,
      ogImage: settings.heroImage || settings.logoUrl,
      sortOrder: 10,
    },
    {
      path: "/contact",
      label: "Contact",
      metaTitle: `Contact · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "contact Bijali Tours, travel enquiry, tour booking, helpline",
      metaDescription: `Contact ${settings.brandName} for a tailored tour proposal, bookings, and round-the-clock support.`,
      ogImage: settings.logoUrl,
      sortOrder: 20,
    },
    {
      path: "/payment",
      label: "Payment",
      metaTitle: `Payment Portal · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "tour payment, booking payment, Bijali Tours",
      metaDescription: `Secure payment portal for ${settings.brandName} bookings.`,
      ogImage: settings.logoUrl,
      sortOrder: 30,
    },
    {
      path: "/terms",
      label: "Terms and Conditions",
      metaTitle: `Terms & Conditions · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "terms and conditions, Bijali Tours, website terms, travel website",
      metaDescription: `Website terms for ${settings.brandName}, including acceptable use, grievances, and Indian law.`,
      ogImage: settings.logoUrl,
      sortOrder: 40,
    },
    {
      path: "/privacy",
      label: "Privacy and Data Rights",
      metaTitle: `Privacy & Data Rights · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "privacy policy, DPDP Act, data principal rights, Bijali Tours",
      metaDescription: `How ${settings.brandName} collects, uses, and shares personal data, and how to use your rights under India’s DPDP Act.`,
      ogImage: settings.logoUrl,
      sortOrder: 41,
    },
    {
      path: "/gdpr",
      label: "GDPR",
      metaTitle: `GDPR Notice · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "GDPR, UK GDPR, data subject rights, international transfer, Bijali Tours",
      metaDescription: `GDPR and UK GDPR notice for ${settings.brandName}, including legal bases, international transfers, and data-subject rights.`,
      ogImage: settings.logoUrl,
      sortOrder: 42,
    },
    {
      path: "/booking-terms",
      label: "Terms of Booking",
      metaTitle: `Terms of Booking · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "booking terms, cancellation policy, tour refund, Bijali Tours",
      metaDescription: `How ${settings.brandName} confirms, changes, and cancels a tour, including refunds and supplier charges.`,
      ogImage: settings.logoUrl,
      sortOrder: 43,
    },
    {
      path: "/faq",
      label: "Concierge FAQs",
      metaTitle: `Concierge FAQs · ${settings.brandName}`.slice(0, 255),
      metaKeywords: "travel FAQ, booking help, visa, cancellation, Bijali Tours",
      metaDescription: `Answers from the ${settings.brandName} concierge on documents, payments, changes, cancellation, and data requests.`,
      ogImage: settings.logoUrl,
      sortOrder: 44,
    },
  ];
  for (const page of staticPages) {
    await prisma.pageSeo.upsert({
      where: { path: page.path },
      create: page,
      update: { label: page.label, sortOrder: page.sortOrder },
    });
  }
  for (const pkg of packages) {
    await syncPackageSeo(pkg);
  }
  const keep = new Set<string>([
    ...staticPages.map((page) => page.path),
    ...packages.map((pkg) => `/packages/${pkg.slug}`),
  ]);
  const rows = await prisma.pageSeo.findMany();
  const stale = rows.filter((row) => !keep.has(row.path)).map((row) => row.id);
  if (stale.length) await prisma.pageSeo.deleteMany({ where: { id: { in: stale } } });
  return prisma.pageSeo.findMany({ orderBy: [{ sortOrder: "asc" }, { label: "asc" }] });
}

export async function listSeoPages() {
  await connection();
  return ensureSeoCatalog();
}
