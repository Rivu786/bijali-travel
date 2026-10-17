"use client";

import { useState } from "react";

export function MediaUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex gap-2">
      <input className="input h-10 min-w-0 font-mono text-xs" readOnly value={url} aria-label="Media URL" onFocus={(event) => event.currentTarget.select()} />
      <button
        type="button"
        className="shrink-0 rounded-lg bg-cyan px-3 text-sm font-semibold text-white"
        onClick={async (event) => {
          const field = event.currentTarget.previousElementSibling;
          if (field instanceof HTMLInputElement) {
            field.focus();
            field.select();
          }
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
          try {
            await navigator.clipboard.writeText(url);
          } catch {
            document.execCommand("copy");
          }
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
