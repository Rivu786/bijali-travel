"use client";

import { useMemo, useState } from "react";

type AssignPackage = {
  id: number;
  title: string;
  groupId?: number | null;
  groupTitle?: string | null;
};

export function PackageAssign({
  packages,
  selectedIds,
  emptyLabel = "No packages in this group yet.",
}: {
  packages: AssignPackage[];
  selectedIds: number[];
  emptyLabel?: string;
}) {
  const [chosen, setChosen] = useState<number[]>(selectedIds);
  const [pick, setPick] = useState("");
  const [query, setQuery] = useState("");
  const byId = new Map(packages.map((item) => [item.id, item]));
  const remaining = packages.filter((item) => !chosen.includes(item.id));
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return remaining;
    return remaining.filter((item) => {
      const haystack = `${item.title} ${item.groupTitle ?? ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, remaining]);

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

      <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-4">
        <p className="mb-3 text-sm font-semibold text-on-surface">Select package to add</p>
        <div className="space-y-3">
          <label className="block text-sm font-semibold">
            Search packages
            <input
              className="input mt-1"
              type="search"
              value={query}
              onChange={(event) => {
                const next = event.target.value;
                setQuery(next);
                const needle = next.trim().toLowerCase();
                if (!pick) return;
                const selected = byId.get(Number(pick));
                if (!selected) {
                  setPick("");
                  return;
                }
                const haystack = `${selected.title} ${selected.groupTitle ?? ""}`.toLowerCase();
                if (needle && !haystack.includes(needle)) setPick("");
              }}
              placeholder="Type to filter by name…"
              autoComplete="off"
              aria-label="Search packages"
            />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <label className="min-w-0 flex-1 text-sm font-semibold">
              Package
              <select
                className="input mt-1"
                value={pick}
                onChange={(event) => setPick(event.target.value)}
                aria-label="Select a package to add to this group"
              >
                <option value="">
                  {filtered.length === 0 ? "No packages match your search…" : "Choose a package…"}
                </option>
                {filtered.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.groupId && item.groupTitle ? `${item.title} (in ${item.groupTitle})` : item.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!pick || filtered.length === 0}
              onClick={() => {
                const id = Number(pick);
                if (!id) return;
                setChosen((current) => [...current, id]);
                setPick("");
                setQuery("");
              }}
            >
              Add to group
            </button>
          </div>
        </div>
        {packages.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No published packages in this category yet. Publish one under Packages first.
          </p>
        ) : remaining.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Every package in this category is already listed above.</p>
        ) : filtered.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No packages match “{query.trim()}”. Clear search to see all.</p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Packages already in another group are marked “(in …)”. Choosing one moves it into this group.
          </p>
        )}
      </div>
    </div>
  );
}
