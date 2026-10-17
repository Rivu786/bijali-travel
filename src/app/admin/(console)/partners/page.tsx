import { saveRepeatable } from "@/app/actions/admin";
import { RepeatRows } from "@/components/admin/repeat-rows";
import { prisma } from "@/lib/db";

export const instant = false;

export default async function PartnersAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Affiliation & Partners</h1>
        <p className="mt-1 text-sm text-muted">
          Each row is one partner. Icon is a Material icon name such as verified, or a built-in mark: iata, ssl, mot.
        </p>
      </div>
      {query.saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Saved.
        </p>
      ) : null}
      <form action={saveRepeatable} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <input type="hidden" name="kind" value="partners" />
        <input type="hidden" name="back" value="/admin/partners" />
        <RepeatRows
          addLabel="Add partner"
          fields={[
            { name: "sort", label: "Order" },
            { name: "markKey", label: "Icon" },
            { name: "name", label: "Title" },
            { name: "caption", label: "Caption" },
          ]}
          initial={partners.map((item) => ({
            sort: String(item.sortOrder),
            markKey: item.markKey ?? "",
            name: item.name,
            caption: item.caption,
          }))}
        />
        <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
          Save partners
        </button>
      </form>
    </div>
  );
}
