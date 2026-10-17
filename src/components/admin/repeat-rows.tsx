"use client";

import { useState } from "react";

type Field = { name: string; label: string; area?: boolean };

export function RepeatRows({
  fields,
  initial,
  addLabel,
}: {
  fields: Field[];
  initial: Record<string, string>[];
  addLabel: string;
}) {
  const blank = Object.fromEntries(fields.map((field) => [field.name, ""]));
  const [rows, setRows] = useState<Record<string, string>[]>(
    initial.length > 0 ? initial : [{ ...blank, sort: "1" }],
  );
  const [open, setOpen] = useState<boolean[]>(() => (initial.length > 0 ? initial.map(() => false) : [true]));

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const summary = summaryFor(row, fields);
        return (
          <div key={index} className="rounded-lg bg-surface-low p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="min-w-0 flex-1 truncate text-sm font-semibold">{summary}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-white px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan"
                  onClick={() => setOpen((current) => current.map((item, itemIndex) => (itemIndex === index ? !item : item)))}
                >
                  {open[index] ? "Close" : "Edit"}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 focus-visible:ring-2 focus-visible:ring-cyan"
                  onClick={() => {
                    if (!window.confirm("Remove this row?")) return;
                    setRows((current) => current.filter((_, item) => item !== index));
                    setOpen((current) => current.filter((_, item) => item !== index));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            {open[index] ? (
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className={`text-sm font-semibold ${field.area ? "md:col-span-2" : ""}`}>
                    {field.label}
                    {field.area ? (
                      <textarea
                        className="input mt-1 min-h-24 py-2"
                        name={field.name}
                        value={row[field.name] ?? ""}
                        autoComplete="off"
                        onChange={(event) => update(index, field.name, event.target.value)}
                      />
                    ) : (
                      <input
                        className="input mt-1"
                        name={field.name}
                        value={row[field.name] ?? ""}
                        autoComplete="off"
                        inputMode={field.name === "sort" ? "numeric" : undefined}
                        onChange={(event) => update(index, field.name, event.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
            ) : (
              fields.map((field) => (
                <input key={field.name} type="hidden" name={field.name} value={row[field.name] ?? ""} />
              ))
            )}
          </div>
        );
      })}
      <button
        type="button"
        className="rounded-lg bg-surface-high px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan"
        onClick={() => {
          setRows((current) => [...current, { ...blank, sort: String(current.length + 1) }]);
          setOpen((current) => [...current, true]);
        }}
      >
        {addLabel}
      </button>
    </div>
  );

  function update(index: number, name: string, value: string) {
    setRows((current) => current.map((row, item) => (item === index ? { ...row, [name]: value } : row)));
  }
}

function summaryFor(row: Record<string, string>, fields: Field[]) {
  const named = fields.find((field) => field.name !== "sort" && row[field.name]?.trim());
  return named ? row[named.name] : "New item";
}
