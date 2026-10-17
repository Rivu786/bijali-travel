export type PackageTier = "Standard" | "Deluxe" | "Super Deluxe";
export type PackageCategory = "weekend" | "domestic" | "international";
export type PackageTagSlug = "recent" | "popular" | "high-demand";

export type TourPackage = {
  id: number;
  slug: string;
  title: string;
  category: PackageCategory;
  region: string;
  state: string | null;
  duration: string;
  nights: number;
  days: number;
  location: string;
  tier: PackageTier;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviews: number;
  summary: string;
  image: string;
  gallery: string[];
  latestBadge?: string | null;
  tags: PackageTagSlug[];
  createdAt: string;
  itinerary: { day: string; title: string; body: string }[];
  inclusions: string[];
  exclusions: string[];
  stays: { name: string; place: string; image: string; category: string }[];
};

export type NavGroup = {
  title: string;
  icon: string;
  category: PackageCategory;
  links: { label: string; href: string }[];
};

export type SiteProfile = {
  brandName: string;
  shortName: string;
  email: string;
  phone: string;
  phoneAlt: string;
  phoneTel: string;
  whatsapp: string;
  logoUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  advisorEyebrow: string;
  advisorTitle: string;
  advisorBody: string;
  advisorImage: string;
  footerBlurb: string;
  subscribeEyebrow: string;
  subscribeTitle: string;
  subscribeBody: string;
};
