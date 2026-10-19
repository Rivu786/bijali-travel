"use client";

import { useState } from "react";
import { addCatalogIcon, deleteCatalogIcon } from "@/app/actions/admin";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Icon } from "@/components/icon";
import { iconCatalog } from "@/lib/icon-catalog";

type CustomIcon = { id: number; name: string };

export function IconCatalog({
  customIcons = [],
  saved,
  error,
}: {
  customIcons?: CustomIcon[];
  saved?: boolean;
  error?: string;
}) {
  const [copied, setCopied] = useState("");
  const [preview, setPreview] = useState("");

  return (
    <div className="space-y-6">
      {saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Icon catalog updated.
        </p>
      ) : null}
      {error === "name" ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-red-700 shadow-sm" aria-live="polite">
          Enter a valid Material Symbols icon name (letters, numbers, underscores).
        </p>
      ) : null}

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Add icon</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Use any{" "}
          <a
            href="https://fonts.google.com/icons"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-secondary underline"
          >
            Material Symbols
          </a>{" "}
          name (for example <span className="font-mono">flight</span> or{" "}
          <span className="font-mono">beach_access</span>). Paste that name into Icon fields across the site.
        </p>
        <form action={addCatalogIcon} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-sm font-semibold">
            Icon name
            <input
              className="input mt-1 font-mono"
              name="name"
              required
              placeholder="e.g. beach_access"
              autoComplete="off"
              onChange={(event) => setPreview(event.target.value.trim().toLowerCase().replace(/\s+/g, "_"))}
            />
          </label>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-low text-secondary">
            {preview ? <Icon name={preview} className="text-[28px]" /> : <span className="text-xs text-muted">—</span>}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-white hover:bg-cyan/90"
          >
            Add icon
          </button>
        </form>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Your icons</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Icons you added. Click a name to copy it; remove ones you no longer need.
        </p>
        {customIcons.length === 0 ? (
          <p className="text-sm text-muted">No custom icons yet. Add one above.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {customIcons.map((item) => (
              <li key={item.id} className="flex items-center gap-2 rounded-lg bg-surface-low px-3 py-2">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-cyan"
                  onClick={() => {
                    void navigator.clipboard.writeText(item.name);
                    setCopied(item.name);
                  }}
                >
                  <Icon name={item.name} className="text-[28px] text-secondary" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm font-semibold">{item.name}</span>
                  <span className="text-xs font-semibold text-muted">
                    {copied === item.name ? "Copied" : "Copy"}
                  </span>
                </button>
                <form action={deleteCatalogIcon}>
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmit
                    label="Remove"
                    message={`Remove icon “${item.name}”?`}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                  />
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

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
