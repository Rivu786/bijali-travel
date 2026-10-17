import type { PackageTier } from "@/lib/types";

export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function tierLabel(tier: "Standard" | "Deluxe" | "SuperDeluxe"): PackageTier {
  if (tier === "SuperDeluxe") return "Super Deluxe";
  return tier;
}

export function tierEnum(label: string): "Standard" | "Deluxe" | "SuperDeluxe" {
  if (label === "Super Deluxe" || label === "SuperDeluxe" || label === "Super Luxe") {
    return "SuperDeluxe";
  }
  if (label === "Standard") return "Standard";
  return "Deluxe";
}

export function categoryLabel(category: string) {
  if (category === "weekend") return "Weekend";
  if (category === "international") return "International";
  return "Domestic";
}

export const stayCategories = [
  { value: "Hstay", label: "Hstay" },
  { value: "Star3", label: "3 star" },
  { value: "Star4", label: "4 star" },
  { value: "Star5", label: "5 star" },
] as const;

export type StayCategoryValue = (typeof stayCategories)[number]["value"];

export function stayCategoryLabel(value: string) {
  return stayCategories.find((item) => item.value === value)?.label ?? "Hstay";
}

export function stayCategoryEnum(value: string): StayCategoryValue {
  return stayCategories.some((item) => item.value === value) ? (value as StayCategoryValue) : "Hstay";
}

export function tagLabel(slug: string) {
  if (slug === "high-demand") return "High demand";
  if (slug === "popular") return "Popular";
  return "Recent";
}
