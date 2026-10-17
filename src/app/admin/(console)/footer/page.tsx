import { saveFooterCopy, savePlacements, saveRepeatable } from "@/app/actions/admin";
import { PackageRank } from "@/components/admin/package-rank";
import { RepeatRows } from "@/components/admin/repeat-rows";
import { prisma } from "@/lib/db";

export const instant = false;

export default async function FooterAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const [settings, badges, packages, placements] = await Promise.all([
    prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.footerBadge.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.package.findMany({
      where: { status: "published" },
      select: { id: true, title: true, category: true },
      orderBy: { title: "asc" },
    }),
    prisma.homePlacement.findMany({ where: { slot: "popular" }, orderBy: { sortOrder: "asc" } }),
  ]);
  const selected = Object.fromEntries(placements.map((item) => [item.packageId, item.sortOrder]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Footer</h1>
        <p className="mt-1 text-sm text-muted">Blurb, subscribe text, trust badges, and popular destinations.</p>
      </div>
      {query.saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Saved.
        </p>
      ) : null}

      <form action={saveFooterCopy} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Text</h2>
        <input type="hidden" name="back" value="/admin/footer" />
        <label className="block text-sm font-semibold">
          Footer blurb
          <textarea className="input mt-1 min-h-24 py-2" name="footerBlurb" defaultValue={settings.footerBlurb} autoComplete="off" />
        </label>
        <label className="block text-sm font-semibold">
          Subscribe eyebrow
          <input className="input mt-1" name="subscribeEyebrow" defaultValue={settings.subscribeEyebrow} autoComplete="off" />
        </label>
        <label className="block text-sm font-semibold">
          Subscribe title
          <input className="input mt-1" name="subscribeTitle" defaultValue={settings.subscribeTitle} autoComplete="off" />
        </label>
        <label className="block text-sm font-semibold">
          Subscribe body
          <textarea className="input mt-1 min-h-24 py-2" name="subscribeBody" defaultValue={settings.subscribeBody} autoComplete="off" />
        </label>
        <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
          Save footer text
        </button>
      </form>

      <form action={saveRepeatable} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Trust badges</h2>
        <input type="hidden" name="kind" value="badges" />
        <input type="hidden" name="back" value="/admin/footer" />
        <RepeatRows
          addLabel="Add badge"
          fields={[
            { name: "sort", label: "Order" },
            { name: "label", label: "Label" },
            { name: "icon", label: "Icon" },
          ]}
          initial={badges.map((item) => ({
            sort: String(item.sortOrder),
            label: item.label,
            icon: item.icon,
          }))}
        />
        <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
          Save badges
        </button>
      </form>

      <form action={savePlacements} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Popular destinations</h2>
        <p className="text-sm text-muted">Add a package to list it here. Remove takes it off the footer.</p>
        <input type="hidden" name="slot" value="popular" />
        <input type="hidden" name="back" value="/admin/footer" />
        <PackageRank packages={packages} selected={selected} />
        <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
          Save destinations
        </button>
      </form>
    </div>
  );
}
