"use client";

import { useEffect, useRef, useState } from "react";

export function HomepageJump({
  items,
  initial,
}: {
  items: readonly (readonly [string, string])[];
  initial?: string;
}) {
  const [active, setActive] = useState(initial && items.some(([id]) => id === initial) ? initial : items[0][0]);
  const bar = useRef<HTMLElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const ids = items.map(([id]) => id);
    const root = document.getElementById("admin-scroll");
    const start = initial ? document.getElementById(initial) : null;
    if (start) start.scrollIntoView();

    const pick = (force = false) => {
      const edge = 180;
      let current = ids[0];
      for (const id of ids) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= edge) current = id;
      }
      if (!force && current === activeRef.current) return;
      activeRef.current = current;
      setActive(current);
      window.dispatchEvent(new CustomEvent("admin-section", { detail: current }));
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };
    root?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const frameId = requestAnimationFrame(() => pick(true));
    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(frame);
      root?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [initial, items]);

  useEffect(() => {
    const barNode = bar.current;
    const node = barNode?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!barNode || !node) return;
    const barRect = barNode.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    if (nodeRect.left < barRect.left || nodeRect.right > barRect.right) {
      barNode.scrollLeft += nodeRect.left - barRect.left - 12;
    }
  }, [active]);

  return (
    <nav ref={bar} className="sticky top-24 z-40 flex gap-2 overflow-x-auto rounded-xl bg-white p-3 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          data-section={id}
          aria-current={active === id ? "true" : undefined}
          className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan ${active === id ? "bg-secondary text-white" : "text-on-surface hover:bg-surface-low"}`}
          onClick={(event) => {
            event.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
