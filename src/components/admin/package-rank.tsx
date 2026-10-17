"use client";

import { useState } from "react";

export function PackageRank({
  packages,
  selected,
}: {
  packages: { id: number; title: string; category: string }[];
  selected: Record<number, number>;
}) {
  const ordered = [...packages].sort((a, b) => (selected[a.id] ?? 999) - (selected[b.id] ?? 999));
  const [chosen, setChosen] = useState<number[]>(() =>
    ordered.filter((item) => selected[item.id] != null).map((item) => item.id),
  );
  const [pick, setPick] = useState("");
  const byId = new Map(packages.map((item) => [item.id, item]));
  const remaining = packages.filter((item) => !chosen.includes(item.id));

  return (
    <div className="space-y-3">
      {chosen.length === 0 ? <p className="text-sm text-muted">No packages selected yet.</p> : null}
      <ol className="space-y-2">
        {chosen.map((id, index) => {
          const item = byId.get(id);
          if (!item) return null;
          return (
            <li key={id} className="flex items-center gap-3 rounded-lg bg-surface-low px-3 py-2">
              <input type="hidden" name="packageId" value={id} />
              <input type="hidden" name="sortOrder" value={index + 1} />
              <span className="w-6 text-sm font-semibold tabular-nums">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.title}</span>
              <span className="text-xs text-muted">{item.category}</span>
              <button
                type="button"
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 focus-visible:ring-2 focus-visible:ring-cyan"
                onClick={() => setChosen((current) => current.filter((itemId) => itemId !== id))}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-0 flex-1 text-sm font-semibold">
          Add a package
          <select
            className="input mt-1"
            value={pick}
            onChange={(event) => setPick(event.target.value)}
          >
            <option value="">Choose a package…</option>
            {remaining.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded-lg bg-surface-high px-4 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan"
          onClick={() => {
            const id = Number(pick);
            if (!id) return;
            setChosen((current) => [...current, id]);
            setPick("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
