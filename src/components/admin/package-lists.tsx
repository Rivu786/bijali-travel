"use client";

import { useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { stayCategories } from "@/lib/format";

type Day = { dayLabel: string; title: string; body: string };
type Stay = { name: string; place: string; imageUrl: string; category: string };
type Row<T> = { id: string; value: T; editing: boolean };

export function PackageLists({
  gallery,
  itinerary,
  inclusions,
  exclusions,
  stays,
}: {
  gallery: string[];
  itinerary: Day[];
  inclusions: string[];
  exclusions: string[];
  stays: Stay[];
}) {
  return (
    <div className="space-y-4">
      <TextList
        title="Gallery"
        hint="One image URL per row"
        name="gallery"
        placeholder="https://…"
        items={gallery}
      />
      <DayList items={itinerary} />
      <TextList title="Inclusions" hint="One item per row" name="inclusions" placeholder="Hotel stay" items={inclusions} />
      <TextList title="Exclusions" hint="One item per row" name="exclusions" placeholder="Flights" items={exclusions} />
      <StayList items={stays} />
    </div>
  );
}

function TextList({
  title,
  hint,
  name,
  placeholder,
  items,
}: {
  title: string;
  hint: string;
  name: string;
  placeholder: string;
  items: string[];
}) {
  const [rows, setRows] = useState<Row<string>[]>(() => withIds(items));
  const nextId = useRef(items.length);

  return (
    <ListShell
      title={title}
      hint={hint}
      count={rows.length}
      onAdd={() => {
        nextId.current += 1;
        setRows((current) => [...current, { id: `n-${nextId.current}`, value: "", editing: true }]);
      }}
    >
      {rows.map((row, index) => (
        <div key={row.id} className="rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{row.value || `New ${title.toLowerCase()} row`}</span>
            <div className="flex gap-2">
              <EditButton
                label={`Edit ${title.toLowerCase()} row ${index + 1}`}
                open={row.editing}
                onClick={() => toggleEdit(setRows, row.id)}
              />
              <RemoveButton label={`Remove ${title.toLowerCase()} row ${index + 1}`} onClick={() => removeRow(setRows, row.id)} />
            </div>
          </div>
          {row.editing ? (
            <input
              className="input mt-2"
              name={name}
              value={row.value}
              placeholder={placeholder}
              onChange={(event) => updateRow(setRows, row.id, event.target.value)}
            />
          ) : (
            <input type="hidden" name={name} value={row.value} />
          )}
        </div>
      ))}
    </ListShell>
  );
}

function DayList({ items }: { items: Day[] }) {
  const [rows, setRows] = useState<Row<Day>[]>(() => withIds(items));
  const nextId = useRef(items.length);

  return (
    <ListShell
      title="Itinerary"
      hint="One day per row"
      count={rows.length}
      onAdd={() => {
        nextId.current += 1;
        const day = rows.length + 1;
        setRows((current) => [
          ...current,
          { id: `n-${nextId.current}`, value: { dayLabel: `Day ${day}`, title: "", body: "" }, editing: true },
        ]);
      }}
    >
      {rows.map((row, index) => (
        <div key={row.id} className="rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{row.value.title || row.value.dayLabel || `Day ${index + 1}`}</span>
            <div className="flex gap-2">
              <EditButton label={`Edit day ${index + 1}`} open={row.editing} onClick={() => toggleEdit(setRows, row.id)} />
              <RemoveButton label={`Remove day ${index + 1}`} onClick={() => removeRow(setRows, row.id)} />
            </div>
          </div>
          {row.editing ? (
            <>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[8rem_1fr]">
                <input
                  className="input"
                  name="itineraryDay"
                  value={row.value.dayLabel}
                  placeholder="Day 1"
                  aria-label={`Day label ${index + 1}`}
                  onChange={(event) => patchRow(setRows, row.id, { dayLabel: event.target.value })}
                />
                <input
                  className="input"
                  name="itineraryTitle"
                  value={row.value.title}
                  placeholder="Title"
                  aria-label={`Day title ${index + 1}`}
                  onChange={(event) => patchRow(setRows, row.id, { title: event.target.value })}
                />
              </div>
              <textarea
                className="input mt-2 h-auto min-h-20 py-3"
                name="itineraryBody"
                value={row.value.body}
                placeholder="What happens this day"
                aria-label={`Day description ${index + 1}`}
                onChange={(event) => patchRow(setRows, row.id, { body: event.target.value })}
              />
            </>
          ) : (
            <>
              <input type="hidden" name="itineraryDay" value={row.value.dayLabel} />
              <input type="hidden" name="itineraryTitle" value={row.value.title} />
              <input type="hidden" name="itineraryBody" value={row.value.body} />
            </>
          )}
        </div>
      ))}
    </ListShell>
  );
}

function StayList({ items }: { items: Stay[] }) {
  const [rows, setRows] = useState<Row<Stay>[]>(() => withIds(items));
  const nextId = useRef(items.length);

  return (
    <ListShell
      title="Accommodation"
      hint="Name, place, image, and category"
      count={rows.length}
      onAdd={() => {
        nextId.current += 1;
        setRows((current) => [
          ...current,
          { id: `n-${nextId.current}`, value: { name: "", place: "", imageUrl: "", category: "Hstay" }, editing: true },
        ]);
      }}
    >
      {rows.map((row, index) => (
        <div key={row.id} className="rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{row.value.name || `Accommodation ${index + 1}`}</span>
            <div className="flex gap-2">
              <EditButton label={`Edit accommodation ${index + 1}`} open={row.editing} onClick={() => toggleEdit(setRows, row.id)} />
              <RemoveButton label={`Remove accommodation ${index + 1}`} onClick={() => removeRow(setRows, row.id)} />
            </div>
          </div>
          {row.editing ? (
          <>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            <select
              className="input"
              name="stayCategory"
              value={row.value.category}
              aria-label={`Accommodation category ${index + 1}`}
              onChange={(event) => patchRow(setRows, row.id, { category: event.target.value })}
            >
              {stayCategories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="input"
              name="stayName"
              value={row.value.name}
              placeholder="Name"
              aria-label={`Accommodation name ${index + 1}`}
              onChange={(event) => patchRow(setRows, row.id, { name: event.target.value })}
            />
            <input
              className="input"
              name="stayPlace"
              value={row.value.place}
              placeholder="Place"
              aria-label={`Accommodation place ${index + 1}`}
              onChange={(event) => patchRow(setRows, row.id, { place: event.target.value })}
            />
            <input
              className="input"
              name="stayImage"
              value={row.value.imageUrl}
              placeholder="Image URL"
              aria-label={`Accommodation image ${index + 1}`}
              onChange={(event) => patchRow(setRows, row.id, { imageUrl: event.target.value })}
            />
          </div>
          </>
          ) : (
            <>
              <input type="hidden" name="stayCategory" value={row.value.category} />
              <input type="hidden" name="stayName" value={row.value.name} />
              <input type="hidden" name="stayPlace" value={row.value.place} />
              <input type="hidden" name="stayImage" value={row.value.imageUrl} />
            </>
          )}
        </div>
      ))}
    </ListShell>
  );
}

function ListShell({
  title,
  hint,
  count,
  onAdd,
  children,
}: {
  title: string;
  hint: string;
  count: number;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-surface-high bg-surface-low p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">
            {title}
            <span className="ml-2 text-xs font-medium text-muted">{count}</span>
          </h2>
          <p className="text-xs text-muted">{hint}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan text-xl leading-none font-semibold text-white"
          aria-label={`Add ${title.toLowerCase()}`}
        >
          +
        </button>
      </div>
      {count === 0 ? (
        <p className="rounded-lg border border-dashed border-outline/40 px-3 py-4 text-center text-sm text-muted">
          Nothing here yet. Use + to add a row.
        </p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  );
}

function EditButton({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan"
    >
      {open ? "Close" : "Edit"}
      <span className="sr-only"> {label}</span>
    </button>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!window.confirm("Remove this row?")) return;
        onClick();
      }}
      className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm focus-visible:ring-2 focus-visible:ring-cyan"
      aria-label={label}
    >
      Remove
    </button>
  );
}

function withIds<T>(items: T[]): Row<T>[] {
  return items.map((value, index) => ({ id: `s-${index}`, value, editing: false }));
}

function toggleEdit<T>(setRows: Dispatch<SetStateAction<Row<T>[]>>, id: string) {
  setRows((current) => current.map((row) => (row.id === id ? { ...row, editing: !row.editing } : row)));
}

function updateRow(setRows: Dispatch<SetStateAction<Row<string>[]>>, id: string, value: string) {
  setRows((current) => current.map((row) => (row.id === id ? { ...row, value } : row)));
}

function patchRow<T>(setRows: Dispatch<SetStateAction<Row<T>[]>>, id: string, patch: Partial<T>) {
  setRows((current) => current.map((row) => (row.id === id ? { ...row, value: { ...row.value, ...patch } } : row)));
}

function removeRow<T>(setRows: Dispatch<SetStateAction<Row<T>[]>>, id: string) {
  setRows((current) => current.filter((row) => row.id !== id));
}
