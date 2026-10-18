import { connection } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mediaSrc } from "@/lib/media-path";
import { tierLabel } from "@/lib/format";
import type { NavGroup, PackageTagSlug, SiteProfile, TourPackage } from "@/lib/types";

const packageInclude = {
  group: true,
  gallery: { orderBy: { sortOrder: "asc" } },
  itinerary: { orderBy: { sortOrder: "asc" } },
  items: { orderBy: { sortOrder: "asc" } },
  stays: { orderBy: { sortOrder: "asc" } },
  tags: { include: { tag: true } },
} satisfies Prisma.PackageInclude;

type PackageRow = Prisma.PackageGetPayload<{ include: typeof packageInclude }>;

function mapPackage(row: PackageRow): TourPackage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    groupId: row.groupId,
    region: row.group?.title ?? row.location,
    state: row.state,
    duration: row.duration,
    nights: row.nights,
    days: row.days,
    location: row.location,
    tier: tierLabel(row.tier),
    price: Number(row.price),
    originalPrice: row.originalPrice == null ? undefined : Number(row.originalPrice),
    currency: row.currency?.toUpperCase() === "USD" ? "INR" : row.currency || "INR",
    rating: Number(row.rating),
    reviews: row.reviewCount,
    summary: row.summary,
    image: mediaSrc(row.imageUrl),
    gallery: row.gallery.map((item) => mediaSrc(item.imageUrl)),
    latestBadge: row.latestBadge,
    tags: row.tags.map((item) => item.tag.slug as PackageTagSlug),
    createdAt: row.createdAt.toISOString(),
    itinerary: row.itinerary.map((day) => ({
      day: day.dayLabel,
      title: day.title,
      body: day.body,
    })),
    inclusions: row.items.filter((item) => item.kind === "inclusion").map((item) => item.label),
    exclusions: row.items.filter((item) => item.kind === "exclusion").map((item) => item.label),
    stays: row.stays.map((stay) => ({
      name: stay.name,
      place: stay.place,
      image: mediaSrc(stay.imageUrl || row.imageUrl),
      category: stay.category,
    })),
  };
}

async function ready() {
  await connection();
}

export async function getSiteProfile(): Promise<SiteProfile> {
  await ready();
  const row = await prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } });
  return {
    brandName: row.brandName,
    shortName: row.shortName,
    email: row.email,
    phone: row.phone,
    phoneAlt: row.phoneAlt,
    phoneTel: row.phoneTel,
    whatsapp: row.whatsapp,
    logoUrl: mediaSrc(row.logoUrl),
    heroEyebrow: row.heroEyebrow,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    heroImage: mediaSrc(row.heroImage),
    advisorEyebrow: row.advisorEyebrow,
    advisorTitle: row.advisorTitle,
    advisorBody: row.advisorBody,
    advisorImage: mediaSrc(row.advisorImage),
    footerBlurb: row.footerBlurb,
    subscribeEyebrow: row.subscribeEyebrow,
    subscribeTitle: row.subscribeTitle,
    subscribeBody: row.subscribeBody,
  };
}

export async function getHomeContent() {
  await ready();
  const sections = await prisma.homeSection.findMany();
  const features = await prisma.homeFeature.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const steps = await prisma.homeStep.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const perks = await prisma.offerPerk.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const points = await prisma.inquiryPoint.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const faqs = await prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const testimonials = await prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const badges = await prisma.footerBadge.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const partners = await prisma.partner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  const placements = await prisma.homePlacement.findMany({ orderBy: { sortOrder: "asc" } });
  const section = Object.fromEntries(
    sections.map((item) => [item.slug, { ...item, imageUrl: item.imageUrl ? mediaSrc(item.imageUrl) : item.imageUrl }]),
  );
  return {
    section,
    features,
    steps,
    perks,
    points,
    faqs,
    testimonials: testimonials.map((item) => ({ ...item, imageUrl: item.imageUrl ? mediaSrc(item.imageUrl) : item.imageUrl })),
    badges,
    partners: partners.map((item) => ({ ...item, logoUrl: item.logoUrl ? mediaSrc(item.logoUrl) : item.logoUrl })),
    placements,
  };
}

export function pickPlaced(
  placements: { slot: string; packageId: number }[],
  slot: string,
  packages: TourPackage[],
) {
  const rows = placements.filter((item) => item.slot === slot);
  if (rows.length === 0) return null;
  const byId = new Map(packages.map((item) => [item.id, item]));
  return rows.flatMap((item) => {
    const tour = byId.get(item.packageId);
    return tour ? [tour] : [];
  });
}

export async function getPublishedPackages() {
  await ready();
  const rows = await prisma.package.findMany({
    where: { status: "published" },
    include: packageInclude,
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(mapPackage);
}

export async function getPackageBySlug(slug: string) {
  await ready();
  const row = await prisma.package.findFirst({
    where: { slug, status: "published" },
    include: packageInclude,
  });
  return row ? mapPackage(row) : null;
}

export async function getNav() {
  await ready();
  const groups = await prisma.menuGroup.findMany({ orderBy: { sortOrder: "asc" } });
  const packages = await prisma.package.findMany({
    where: { status: "published" },
    select: { id: true, slug: true, title: true, category: true, groupId: true },
    orderBy: { title: "asc" },
  });
  const weekendOrder = await prisma.homePlacement.findMany({
    where: { slot: "weekend" },
    orderBy: { sortOrder: "asc" },
  });
  const columns = (category: "domestic" | "international"): NavGroup[] =>
    groups
      .filter((group) => group.category === category)
      .map((group) => ({
        title: group.title,
        icon: group.icon,
        category: group.category,
        links: packages
          .filter((item) => item.groupId === group.id)
          .map((item) => ({ label: item.title, href: `/packages/${item.slug}` })),
      }))
      .filter((group) => group.links.length > 0);
  const byId = new Map(packages.map((item) => [item.id, item]));
  const weekendPlaced = weekendOrder.flatMap((item) => {
    const tour = byId.get(item.packageId);
    return tour ? [{ label: tour.title, href: `/packages/${tour.slug}` }] : [];
  });
  const weekend =
    weekendPlaced.length > 0
      ? weekendPlaced
      : packages
          .filter((item) => item.category === "weekend")
          .map((item) => ({ label: item.title, href: `/packages/${item.slug}` }));
  const international = columns("international");
  const internationalLinks = packages
    .filter((item) => item.category === "international")
    .map((item) => ({ label: item.title, href: `/packages/${item.slug}` }));
  return {
    domestic: columns("domestic"),
    weekend,
    international:
      international.length > 0
        ? international
        : internationalLinks.length > 0
          ? [{ title: "International", icon: "public", category: "international" as const, links: internationalLinks }]
          : [],
  };
}

export function covetedPackages(packages: TourPackage[]) {
  const tagged = packages
    .filter((item) => item.category === "international" && item.tags.includes("high-demand"))
    .sort((a, b) => b.rating - a.rating);
  if (tagged.length > 0) return tagged.slice(0, 4);
  return packages
    .filter((item) => item.category === "international")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
}

export function recentPackages(packages: TourPackage[]) {
  const tagged = packages
    .filter((item) => item.tags.includes("recent"))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  if (tagged.length > 0) return tagged.slice(0, 3);
  return [...packages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 3);
}

export function relatedPackages(tour: TourPackage, packages: TourPackage[], limit = 3) {
  const others = packages.filter((item) => item.id !== tour.id);
  const sameGroup = tour.groupId
    ? others.filter((item) => item.groupId === tour.groupId)
    : [];
  const otherGroups = others.filter((item) => !tour.groupId || item.groupId !== tour.groupId);
  return [...sameGroup, ...otherGroups].slice(0, limit);
}

export function popularPackages(packages: TourPackage[]) {
  const tagged = packages.filter((item) => item.tags.includes("popular"));
  return (tagged.length > 0 ? tagged : packages).slice(0, 5);
}
