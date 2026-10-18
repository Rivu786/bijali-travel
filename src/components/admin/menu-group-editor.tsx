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
  groups,
}: {
  id: number;
  title: string;
  icon: string;
  sortOrder: number;
  category: string;
  packages: { id: number; title: string; groupId: number | null }[];
  groups: { id: number; title: string }[];
}) {
  const groupTitle = new Map(groups.map((group) => [group.id, group.title]));
  const mine = packages.filter((item) => item.groupId === id);
  const assignable = packages.map((item) => ({
    id: item.id,
    title: item.title,
    groupId: item.groupId,
    groupTitle: item.groupId && item.groupId !== id ? (groupTitle.get(item.groupId) ?? "another group") : null,
  }));

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
        <p className="mb-3 text-sm text-muted">
          Remove takes a package out of this group. Use the select box below the list to add one, then click Save.
        </p>
        <PackageAssign
          packages={assignable}
          selectedIds={mine.map((item) => item.id)}
          emptyLabel="No packages in this group yet. Add one below."
        />
      </fieldset>
      <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
        Save {title}
      </button>
    </form>
  );
}
