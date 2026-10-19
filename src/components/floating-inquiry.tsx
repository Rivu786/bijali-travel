"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { InquiryForm } from "@/components/inquiry-form";

export function FloatingInquiry() {
  const pathname = usePathname() || "/";
  const [closed, setClosed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setClosed(false);
    setReady(false);
    const timer = window.setTimeout(() => setReady(true), 15_000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname === "/contact" || pathname === "/payment") {
    return null;
  }
  if (closed || !ready) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-3 sm:p-5">
      <div
        className="pointer-events-auto flex max-h-[min(88vh,720px)] w-full max-w-md flex-col overflow-hidden rounded-xl bg-surface-lowest text-on-surface shadow-xl ring-1 ring-black/10"
        role="dialog"
        aria-label="Plan your trip"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-surface-high bg-ink px-4 py-3 text-white">
          <div>
            <p className="eyebrow text-sky">Free callback</p>
            <h2 className="text-base font-semibold">Plan Your Custom Trip</h2>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
            aria-label="Close inquiry form"
            onClick={() => setClosed(true)}
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">
          <InquiryForm page={pathname} />
        </div>
      </div>
    </div>
  );
}
