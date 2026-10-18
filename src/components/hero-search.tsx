"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Icon } from "@/components/icon";

export function HeroSearch({
  defaultQuery = "",
  defaultTier = "Deluxe",
}: {
  defaultQuery?: string;
  defaultTier?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery);
  const [tier, setTier] = useState(defaultTier);
  const [pending, setPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const query = q.trim();
    if (query) params.set("q", query);
    if (tier) params.set("tier", tier);
    setPending(true);
    const href = params.toString() ? `/packages?${params.toString()}` : "/packages";
    router.push(href);
  }

  return (
    <form
      action="/packages"
      method="get"
      onSubmit={onSubmit}
      className="w-full max-w-5xl rounded-xl bg-white/85 p-4 text-left shadow-xl backdrop-blur-xl md:p-6"
    >
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 rounded-lg bg-surface-low/70 p-2">
          <span className="eyebrow flex items-center gap-1 font-bold text-secondary">
            <Icon name="pin_drop" className="text-[16px]" /> Destination
          </span>
          <input
            name="q"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            className="w-full truncate bg-transparent text-lg font-semibold outline-none"
            placeholder="Destination, state, or package name"
            autoComplete="off"
            aria-label="Search destination, state, or package name"
          />
        </label>
        <label className="flex flex-col gap-1 rounded-lg bg-surface-low/70 p-2">
          <span className="eyebrow flex items-center gap-1 font-bold text-secondary">
            <Icon name="hotel_class" className="text-[16px]" /> Package Tier
          </span>
          <select
            name="tier"
            value={tier}
            onChange={(event) => setTier(event.target.value)}
            className="w-full bg-transparent text-lg font-semibold outline-none"
            aria-label="Package tier"
          >
            <option value="">All Tiers (Customized)</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Super Deluxe">Super Deluxe</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Icon name="verified" className="text-[16px] text-secondary" /> Zero booking fees
          </span>
          <span className="flex items-center gap-1">
            <Icon name="thumb_up" className="text-[16px] text-secondary" /> 100% Tailor-made
          </span>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3.5 text-sm font-semibold text-white shadow-md focus-visible:ring-2 focus-visible:ring-cyan disabled:opacity-70 sm:w-auto"
        >
          <Icon name="travel_explore" className="text-[18px]" />
          {pending ? "Searching…" : "Find My Trip"}
        </button>
      </div>
    </form>
  );
}
