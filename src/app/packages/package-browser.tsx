"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { PackageCard } from "@/components/package-card";
import type { PackageCategory, PackageTagSlug, PackageTier, TourPackage } from "@/lib/types";

const categories: Array<PackageCategory | "All"> = ["All", "weekend", "domestic", "international"];
const tags: Array<PackageTagSlug | "All"> = ["All", "recent", "popular", "high-demand"];
const tiers: Array<PackageTier | "All"> = ["All", "Standard", "Deluxe", "Super Deluxe"];

const categoryName: Record<string, string> = {
  All: "All",
  weekend: "Weekend",
  domestic: "Domestic",
  international: "International",
};

const tagName: Record<string, string> = {
  All: "All",
  recent: "Recent",
  popular: "Popular",
  "high-demand": "High demand",
};

export function PackageBrowser({
  packages,
  initialTier,
  initialQuery,
  initialCategory,
  initialTag,
}: {
  packages: TourPackage[];
  initialTier?: string;
  initialQuery?: string;
  initialCategory?: string;
  initialTag?: string;
}) {
  const [category, setCategory] = useState(
    categories.includes(initialCategory as PackageCategory) ? (initialCategory as PackageCategory) : "All",
  );
  const [tag, setTag] = useState<PackageTagSlug | "All">(
    tags.includes(initialTag as PackageTagSlug) ? (initialTag as PackageTagSlug) : "All",
  );
  const [tier, setTier] = useState<PackageTier | "All">(
    tiers.includes(initialTier as PackageTier) ? (initialTier as PackageTier) : "All",
  );
  const [q, setQ] = useState(initialQuery || "");
  const [sort, setSort] = useState("rating");

  const matched = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = packages.filter((tour) => {
      if (category !== "All" && tour.category !== category) return false;
      if (tag !== "All" && !tour.tags.includes(tag)) return false;
      if (!query) return true;
      const haystack = `${tour.title} ${tour.location} ${tour.state ?? ""} ${tour.region} ${tour.summary}`.toLowerCase();
      return haystack.includes(query);
    });
    const sorted = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      return b.rating - a.rating;
    });
    if (tier === "All") return { preferred: sorted, also: [] as TourPackage[] };
    return {
      preferred: sorted.filter((tour) => tour.tier === tier),
      also: sorted.filter((tour) => tour.tier !== tier),
    };
  }, [packages, category, tag, tier, q, sort]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">Filter Your Trip</h2>
        <label className="mb-5 block">
          <span className="eyebrow mb-2 block text-muted">Search</span>
          <div className="relative">
            <Icon
              name="search"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-outline"
            />
            <input
              className="input pl-10"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Destination, state, or name"
            />
          </div>
        </label>
        <div className="mb-5">
          <span className="eyebrow mb-2 block text-muted">Category</span>
          <div className="flex flex-col gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-lg px-3 py-2 text-left text-sm ${
                  category === item ? "bg-cyan text-white" : "bg-surface-low hover:bg-surface-high"
                }`}
              >
                {categoryName[item]}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <span className="eyebrow mb-2 block text-muted">Tag</span>
          <div className="flex flex-col gap-2">
            {tags.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                className={`rounded-lg px-3 py-2 text-left text-sm ${
                  tag === item ? "bg-cyan text-white" : "bg-surface-low hover:bg-surface-high"
                }`}
              >
                {tagName[item]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow mb-2 block text-muted">Travel Style</span>
          <div className="flex flex-col gap-2">
            {tiers.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTier(item)}
                className={`rounded-lg px-3 py-2 text-left text-sm ${
                  tier === item ? "bg-cyan text-white" : "bg-surface-low hover:bg-surface-high"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            Showing {matched.preferred.length + matched.also.length} of {packages.length} packages
          </p>
          <select
            className="input h-10 w-full sm:w-56"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="rating">Sort by: Rating</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {matched.preferred.map((tour) => (
            <PackageCard key={tour.slug} tour={tour} />
          ))}
        </div>
        {matched.also.length > 0 ? (
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-semibold">Also available in other tiers</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {matched.also.map((tour) => (
                <PackageCard key={tour.slug} tour={tour} />
              ))}
            </div>
          </div>
        ) : null}
        {matched.preferred.length + matched.also.length === 0 ? (
          <p className="rounded-xl bg-white p-10 text-center text-muted">
            No packages match that destination, state, or name.
          </p>
        ) : null}
      </div>
    </div>
  );
}
