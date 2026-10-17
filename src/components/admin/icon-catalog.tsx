"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { iconCatalog } from "@/lib/icon-catalog";

export function IconCatalog() {
  const [copied, setCopied] = useState("");

  return (
    <div className="space-y-6">
      {iconCatalog.map((group) => (
        <section key={group.title} className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{group.title}</h2>
          <p className="mt-1 mb-4 text-sm text-muted">{group.hint} Click a name to copy it.</p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {group.names.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg bg-surface-low px-3 py-2 text-left focus-visible:ring-2 focus-visible:ring-cyan"
                  onClick={() => {
                    void navigator.clipboard.writeText(name);
                    setCopied(name);
                  }}
                >
                  <Icon name={name} className="text-[28px] text-secondary" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm font-semibold">{name}</span>
                  <span className="text-xs font-semibold text-muted">{copied === name ? "Copied" : "Copy"}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
