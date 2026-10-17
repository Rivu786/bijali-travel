"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const groups: { label: string; links: [string, string][] }[] = [
  { label: "Site", links: [["Overview", "/admin"], ["Icons", "/admin/icons"]] },
  {
    label: "Homepage",
    links: [
      ["Banner", "/admin/homepage?section=banner#banner"],
      ["Distinction cards", "/admin/homepage?section=distinction#distinction"],
      ["Voyage steps", "/admin/homepage?section=voyage#voyage"],
      ["Coveted escapes", "/admin/homepage?section=coveted#coveted"],
      ["Custom trip", "/admin/homepage?section=inquiry#inquiry"],
      ["New departures", "/admin/homepage?section=departures#departures"],
      ["Privileges", "/admin/homepage?section=privileges#privileges"],
      ["Advisor", "/admin/homepage?section=advisor#advisor"],
      ["Testimonials", "/admin/homepage?section=testimonials#testimonials"],
      ["FAQs", "/admin/homepage?section=faq#faq"],
    ],
  },
  { label: "Navigation", links: [["Menus", "/admin/menus"]] },
  { label: "Footer area", links: [["Partners", "/admin/partners"], ["Footer", "/admin/footer"]] },
  {
    label: "Catalog",
    links: [
      ["Packages", "/admin/packages"],
      ["Media", "/admin/media"],
    ],
  },
  {
    label: "Inbox",
    links: [
      ["Callback requests", "/admin/inquiries"],
      ["Subscribers", "/admin/subscribers"],
    ],
  },
];

function isCurrent(path: string, section: string | null, href: string) {
  const url = new URL(href, "http://local");
  if (url.pathname === "/admin") return path === "/admin";
  const wanted = url.searchParams.get("section");
  if (wanted) return path === url.pathname && section === wanted;
  return path === url.pathname || path.startsWith(`${url.pathname}/`);
}

export function AdminNav() {
  const path = usePathname();
  const section = useSearchParams().get("section");
  const [live, setLive] = useState<string | null>(null);
  const shown = path === "/admin/homepage" && live ? live : section;

  useEffect(() => {
    setLive(null);
  }, [path]);

  useEffect(() => {
    const onSection = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      setLive(next);
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      const link = document.querySelector<HTMLElement>(`[data-admin-section="${next}"]`);
      const aside = link?.closest("aside");
      if (!link || !aside) return;
      const linkRect = link.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      if (linkRect.top < asideRect.top || linkRect.bottom > asideRect.bottom) {
        aside.scrollTop += linkRect.top - asideRect.top - 8;
      }
    };
    window.addEventListener("admin-section", onSection);
    return () => window.removeEventListener("admin-section", onSection);
  }, []);

  return (
    <nav className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="eyebrow mb-1 px-3 text-sky">{group.label}</p>
          <div className="flex flex-col gap-1">
            {group.links.map(([label, href]) => {
              const current = isCurrent(path, shown, href);
              const hash = href.split("#")[1];
              return (
                <Link
                  key={href}
                  href={href}
                  data-admin-section={hash}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan ${current ? "bg-secondary text-white" : "text-on-surface hover:bg-surface-low"}`}
                  onClick={(event) => {
                    if (path !== "/admin/homepage" || !hash) return;
                    event.preventDefault();
                    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
