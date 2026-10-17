"use client";

import { useState } from "react";

export function PackageAssign({
  packages,
  selectedIds,
  emptyLabel = "No packages in this group yet.",
}: {
  packages: { id: number; title: string }[];
  selectedIds: number[];
  emptyLabel?: string;
}) {
  const [chosen, setChosen] = useState<number[]>(selectedIds);
  const [pick, setPick] = useState("");
  const byId = new Map(packages.map((item) => [item.id, item]));
  const remaining = packages.filter((item) => !chosen.includes(item.id));

  return (
    <div className="space-y-3">
      {chosen.length === 0 ? <p className="text-sm text-muted">{emptyLabel}</p> : null}
      <ul className="space-y-2">
        {chosen.map((id) => {
          const item = byId.get(id);
          if (!item) return null;
          return (
            <li key={id} className="flex items-center gap-3 rounded-lg bg-surface-low px-3 py-2">
              <input type="hidden" name="packageId" value={id} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.title}</span>
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
      </ul>
      {remaining.length > 0 ? (
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-0 flex-1 text-sm font-semibold">
            Add a package
            <select className="input mt-1" value={pick} onChange={(event) => setPick(event.target.value)}>
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
            className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan"
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
      ) : null}
    </div>
  );
}
