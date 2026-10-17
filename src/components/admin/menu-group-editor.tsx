"use client";

import { deleteMenuGroup, saveMenuGroup } from "@/app/actions/admin";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PackageAssign } from "@/components/admin/package-assign";

export function MenuGroupEditor({
  id,
  title,
  icon,
  sortOrder,
  category,
  packages,
}: {
  id: number;
  title: string;
  icon: string;
  sortOrder: number;
  category: string;
  packages: { id: number; title: string; groupId: number | null }[];
}) {
  const mine = packages.filter((item) => item.groupId === id);
  const free = packages.filter((item) => item.groupId == null || item.groupId === id);

  return (
    <form action={saveMenuGroup} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold">{title}</p>
        <ConfirmSubmit
          formAction={deleteMenuGroup}
          label="Remove group"
          message={`Delete the ${title} group?`}
          className="rounded-lg bg-surface-high px-3 py-2 text-sm font-semibold text-red-700 focus-visible:ring-2 focus-visible:ring-cyan"
        />
      </div>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="category" value={category} />
      <label className="block text-sm font-semibold">
        Group name
        <input className="input mt-1" name="title" defaultValue={title} required autoComplete="off" />
      </label>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Icon
          <input className="input mt-1" name="icon" defaultValue={icon} autoComplete="off" />
        </label>
        <label className="block text-sm font-semibold">
          Order
          <input className="input mt-1" name="sortOrder" inputMode="numeric" defaultValue={String(sortOrder)} autoComplete="off" />
        </label>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Packages in {title}</legend>
        <p className="mb-3 text-sm text-muted">Add or remove packages here, then save. A package can belong to one group.</p>
        <PackageAssign
          packages={free.map((item) => ({ id: item.id, title: item.title }))}
          selectedIds={mine.map((item) => item.id)}
        />
      </fieldset>
      <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
        Save {title}
      </button>
    </form>
  );
}
