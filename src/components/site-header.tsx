"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import type { NavGroup } from "@/lib/types";

const submenuLinkClass =
  "block rounded-r-lg border-l-4 border-cyan bg-surface-low px-3 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-cyan/10";

const navTriggerClass =
  "flex items-center gap-1 px-3 py-2 text-sm font-semibold text-muted hover:text-cyan";

function MegaPanel({ groups }: { groups: NavGroup[] }) {
  return (
    <div className="pointer-events-none invisible absolute top-full left-1/2 z-50 w-[min(1100px,calc(100vw-3rem))] -translate-x-1/2 pt-1 opacity-0 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
      <div className="rounded-xl border border-surface-high bg-white p-6 shadow-2xl">
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((col) => (
              <div key={col.title} className="flex flex-col gap-2.5">
                <div className="mb-1 flex items-center gap-2 border-b border-surface-container pb-1">
                  <Icon name={col.icon} className="text-[20px] text-cyan" />
                  <h4 className="text-[15px] font-bold tracking-wide text-[#07122b] uppercase">
                    {col.title}
                  </h4>
                </div>
                <MegaLinks items={col.links} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No packages in this menu yet.</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-surface-container pt-3 text-[13px] text-muted">
          <span className="flex items-center gap-1.5">
            <Icon name="flight_takeoff" className="text-[16px] text-cyan" />
            Tailor-made customizations available for all routes
          </span>
          <Link href="/packages" className="flex items-center gap-1 font-bold text-cyan hover:underline">
            View all tour itineraries
            <Icon name="arrow_forward" className="text-[15px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MegaLinks({
  items,
}: {
  items: { label: string; href: string; accent?: "amber" | "cyan" }[];
}) {
  return (
    <div className="flex max-h-[380px] flex-col gap-1.5 overflow-y-auto pr-1">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className={submenuLinkClass}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader({
  logoUrl,
  brandName,
  shortName,
  domestic,
  weekend,
  international,
}: {
  logoUrl: string;
  brandName: string;
  shortName: string;
  domestic: NavGroup[];
  weekend: { label: string; href: string }[];
  international: NavGroup[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<
    null | "domestic" | "weekend" | "international" | "mobile"
  >(null);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-cyan/20 bg-surface/95 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            alt={brandName}
            src={logoUrl}
            width={96}
            height={48}
            className="h-12 rounded object-contain shadow-sm"
            style={{ width: "auto" }}
            unoptimized
          />
          <span className="flex flex-col leading-none font-bold tracking-tight text-on-surface uppercase">
            <span className="text-[20px]">{shortName}</span>
            <span className="text-[13px] font-normal tracking-widest text-cyan">
              Tours & Travels
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className={`px-2 py-2 text-[13px] font-semibold ${pathname === "/" ? "text-on-surface" : "text-muted hover:text-cyan"}`}
          >
            Home
          </Link>
          <div className="group relative">
            <button type="button" className={navTriggerClass}>
              Weekend Holidays <Icon name="expand_more" className="text-[18px]" />
            </button>
            <div className="pointer-events-none invisible absolute top-full left-0 z-50 pt-1 opacity-0 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-64 space-y-1 rounded-xl border border-surface-high bg-white p-3 shadow-xl">
                {weekend.map((item) => (
                  <Link key={item.label} href={item.href} className={submenuLinkClass}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="group relative">
            <button type="button" className={navTriggerClass}>
              Domestic Tour <Icon name="expand_more" className="text-[18px]" />
            </button>
            <MegaPanel groups={domestic} />
          </div>
          <div className="group relative">
            <button type="button" className={navTriggerClass}>
              International Tour <Icon name="expand_more" className="text-[18px]" />
            </button>
            <MegaPanel groups={international} />
          </div>
          <Link
            href="/contact"
            className="px-2 py-2 text-[13px] font-semibold text-muted hover:text-cyan"
          >
            Contact
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            href="/payment"
            className="hidden items-center gap-1.5 rounded-lg bg-amber px-4 py-2 text-[13px] font-bold text-white shadow transition-all hover:bg-amber-deep active:scale-[0.98] sm:flex"
          >
            <Icon name="credit_card" className="text-[16px]" /> Pay Now
          </Link>
          <button
            type="button"
            className="rounded-lg border border-outline-variant p-2 lg:hidden"
            onClick={() => setOpen(open === "mobile" ? null : "mobile")}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      {open === "mobile" ? (
        <div className="space-y-2 border-t border-surface-high bg-white px-4 py-4 lg:hidden">
          {[
            ["Home", "/"],
            ["Packages", "/packages"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-lg px-3 py-2 font-semibold hover:bg-surface-low"
              onClick={() => setOpen(null)}
            >
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
