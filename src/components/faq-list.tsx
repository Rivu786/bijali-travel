"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-4">
      {faqs.map((item, i) => {
        const expanded = open === i;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl bg-surface-lowest shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-6 text-left text-lg font-semibold hover:text-secondary"
              onClick={() => setOpen(expanded ? -1 : i)}
              aria-expanded={expanded}
            >
              <span>{item.question}</span>
              <Icon
                name="expand_more"
                className={`text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
            {expanded ? (
              <p className="px-6 pb-6 text-lg text-muted">{item.answer}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
