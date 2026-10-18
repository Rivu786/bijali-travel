"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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

function parseTier(value?: string): PackageTier | "All" {
  return tiers.includes(value as PackageTier) ? (value as PackageTier) : "All";
}

function parseCategory(value?: string): PackageCategory | "All" {
  return categories.includes(value as PackageCategory) ? (value as PackageCategory) : "All";
}

function parseTag(value?: string): PackageTagSlug | "All" {
  return tags.includes(value as PackageTagSlug) ? (value as PackageTagSlug) : "All";
}

function matchesQuery(tour: TourPackage, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    tour.title,
    tour.location,
    tour.state ?? "",
    tour.region,
    tour.summary,
    tour.category,
    tour.tier,
    tour.duration,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState(parseCategory(initialCategory));
  const [tag, setTag] = useState(parseTag(initialTag));
  const [tier, setTier] = useState(parseTier(initialTier));
  const [q, setQ] = useState(initialQuery || "");
  const [sort, setSort] = useState("rating");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersRef = useRef({ q, tier, category, tag });
  filtersRef.current = { q, tier, category, tag };

  useEffect(() => {
    setCategory(parseCategory(initialCategory));
    setTag(parseTag(initialTag));
    setTier(parseTier(initialTier));
    setQ(initialQuery || "");
  }, [initialCategory, initialTag, initialTier, initialQuery]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  function syncUrl(next: {
    q?: string;
    tier?: PackageTier | "All";
    category?: PackageCategory | "All";
    tag?: PackageTagSlug | "All";
  }) {
    const current = filtersRef.current;
    const params = new URLSearchParams();
    const query = (next.q ?? current.q).trim();
    const nextTier = next.tier ?? current.tier;
    const nextCategory = next.category ?? current.category;
    const nextTag = next.tag ?? current.tag;
    if (query) params.set("q", query);
    if (nextTier !== "All") params.set("tier", nextTier);
    if (nextCategory !== "All") params.set("category", nextCategory);
    if (nextTag !== "All") params.set("tag", nextTag);
    const href = params.toString() ? `/packages?${params.toString()}` : "/packages";
    startTransition(() => router.replace(href, { scroll: false }));
  }

  function scheduleSearchSync(value: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => syncUrl({ q: value }), 250);
  }

  const matched = useMemo(() => {
    const list = packages.filter((tour) => {
      if (category !== "All" && tour.category !== category) return false;
      if (tag !== "All" && !tour.tags.includes(tag)) return false;
      return matchesQuery(tour, q);
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
              onChange={(e) => {
                const value = e.target.value;
                setQ(value);
                scheduleSearchSync(value);
              }}
              placeholder="Destination, state, or name"
              aria-label="Search packages"
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
                onClick={() => {
                  setCategory(item);
                  syncUrl({ category: item });
                }}
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
                onClick={() => {
                  setTag(item);
                  syncUrl({ tag: item });
                }}
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
                onClick={() => {
                  setTier(item);
                  syncUrl({ tier: item });
                }}
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

      <div className={pending ? "opacity-80 transition-opacity" : undefined}>
        {(q.trim() || tier !== "All" || category !== "All" || tag !== "All") && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
            <span className="font-semibold text-on-surface">Active search:</span>
            {q.trim() ? <span className="rounded-full bg-surface-low px-3 py-1">“{q.trim()}”</span> : null}
            {tier !== "All" ? <span className="rounded-full bg-surface-low px-3 py-1">{tier}</span> : null}
            {category !== "All" ? (
              <span className="rounded-full bg-surface-low px-3 py-1">{categoryName[category]}</span>
            ) : null}
            {tag !== "All" ? <span className="rounded-full bg-surface-low px-3 py-1">{tagName[tag]}</span> : null}
            <button
              type="button"
              className="ml-auto text-sm font-semibold text-cyan hover:underline"
              onClick={() => {
                setQ("");
                setTier("All");
                setCategory("All");
                setTag("All");
                startTransition(() => router.replace("/packages", { scroll: false }));
              }}
            >
              Clear
            </button>
          </div>
        )}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            Showing {matched.preferred.length}
            {matched.also.length > 0 ? ` (+${matched.also.length} other tiers)` : ""} of {packages.length}{" "}
            packages
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
