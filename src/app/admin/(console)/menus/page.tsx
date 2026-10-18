import Link from "next/link";
import { saveMenuGroup, savePlacements } from "@/app/actions/admin";
import { MenuGroupEditor } from "@/components/admin/menu-group-editor";
import { PackageAssign } from "@/components/admin/package-assign";
import { PackageRank } from "@/components/admin/package-rank";
import { prisma } from "@/lib/db";

export const instant = false;

const tabs = [
  ["domestic", "Domestic"],
  ["international", "International"],
  ["weekend", "Weekend"],
] as const;

export default async function MenusAdmin({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; saved?: string; error?: string }>;
}) {
  const query = await searchParams;
  const tab = tabs.some(([id]) => id === query.tab) ? (query.tab as (typeof tabs)[number][0]) : "domestic";
  const [groups, packages, placements] = await Promise.all([
    prisma.menuGroup.findMany({
      where: { category: tab === "weekend" ? "domestic" : tab },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.package.findMany({
      where: { status: "published", category: tab },
      select: { id: true, title: true, category: true, groupId: true },
      orderBy: { title: "asc" },
    }),
    prisma.homePlacement.findMany({ where: { slot: "weekend" }, orderBy: { sortOrder: "asc" } }),
  ]);
  const weekendSelected = Object.fromEntries(placements.map((item) => [item.packageId, item.sortOrder]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Menus</h1>
        <p className="mt-1 text-sm text-muted">
          Name a group, then use Add to put packages under it. Remove takes a package out of that group. A package can sit in one group.
        </p>
      </div>
      {query.saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Saved.
        </p>
      ) : null}
      {query.error ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-red-700 shadow-sm" aria-live="polite">
          Add a group name before saving.
        </p>
      ) : null}
      <div className="flex gap-2">
        {tabs.map(([id, label]) => (
          <Link
            key={id}
            href={`/admin/menus?tab=${id}`}
            className={`rounded-lg px-4 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan ${tab === id ? "bg-secondary text-white" : "bg-white text-on-surface hover:bg-surface-low"}`}
            aria-current={tab === id ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      {tab === "weekend" ? (
        <form action={savePlacements} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Weekend holidays</h2>
          <p className="text-sm text-muted">Add a weekend package to show it in the menu. Remove takes it off the menu.</p>
          <input type="hidden" name="slot" value="weekend" />
          <input type="hidden" name="back" value="/admin/menus?tab=weekend" />
          <PackageRank packages={packages} selected={weekendSelected} />
          <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
            Save weekend menu
          </button>
        </form>
      ) : (
        <>
          <form action={saveMenuGroup} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">New {tab} group</h2>
            <input type="hidden" name="category" value={tab} />
            <label className="block text-sm font-semibold">
              Group name
              <input className="input mt-1" name="title" required autoComplete="off" />
            </label>
            <label className="block text-sm font-semibold">
              Icon
              <input className="input mt-1" name="icon" defaultValue="travel_explore" autoComplete="off" />
            </label>
            <label className="block text-sm font-semibold">
              Order
              <input className="input mt-1" name="sortOrder" inputMode="numeric" defaultValue={String(groups.length + 1)} autoComplete="off" />
            </label>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Packages in this group</legend>
              <p className="mb-3 text-sm text-muted">
                Add packages here before saving. If a package is already in another group, choosing it moves it into this new group.
              </p>
              <PackageAssign
                packages={packages.map((item) => ({
                  id: item.id,
                  title: item.title,
                  groupId: item.groupId,
                  groupTitle: item.groupId
                    ? (groups.find((group) => group.id === item.groupId)?.title ?? "another group")
                    : null,
                }))}
                selectedIds={[]}
                emptyLabel="No packages selected yet. Add one below."
              />
            </fieldset>
            <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
              Add group
            </button>
          </form>

          {groups.length === 0 ? <p className="text-sm text-muted">No groups in this menu yet.</p> : null}
          {groups.map((group) => (
            <MenuGroupEditor
              key={group.id}
              id={group.id}
              title={group.title}
              icon={group.icon}
              sortOrder={group.sortOrder}
              category={tab}
              packages={packages}
              groups={groups.map((item) => ({ id: item.id, title: item.title }))}
            />
          ))}
        </>
      )}
    </div>
  );
}

