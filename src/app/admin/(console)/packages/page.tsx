import Link from "next/link";
import { categoryLabel, tagLabel, tierLabel } from "@/lib/format";
import { prisma } from "@/lib/db";

export default async function PackagesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const packages = await prisma.package.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Packages</h1>
        <Link href="/admin/packages/new" className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white">
          Add package
        </Link>
      </div>
      {params.error ? <p className="mb-4 text-sm text-red-700">Title and slug are required.</p> : null}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-muted">
            <tr>
              <th className="p-3">Package</th>
              <th className="p-3">Category</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3">
                  <Link href={`/admin/packages/${item.id}`} className="font-semibold hover:text-secondary">
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted">{item.status}</p>
                </td>
                <td className="p-3">{categoryLabel(item.category)}</td>
                <td className="p-3">{tierLabel(item.tier)}</td>
                <td className="p-3">{item.tags.map((tag) => tagLabel(tag.tag.slug)).join(", ")}</td>
                <td className="p-3">{Number(item.rating).toFixed(1)}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/packages/${item.id}`}
                    className="rounded-lg bg-surface-low px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-cyan"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
