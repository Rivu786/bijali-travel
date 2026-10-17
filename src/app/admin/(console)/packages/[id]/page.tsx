import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { prisma } from "@/lib/db";

export const instant = false;

export default async function EditPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [tour, groups, tags] = await Promise.all([
    prisma.package.findUnique({
      where: { id: Number(id) },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
        itinerary: { orderBy: { sortOrder: "asc" } },
        items: { orderBy: { sortOrder: "asc" } },
        stays: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.menuGroup.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!tour) notFound();

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">{tour.title}</h1>
      {query.saved ? <p className="mb-4 text-sm text-secondary">Saved.</p> : null}
      <PackageForm tour={tour} groups={groups} tags={tags} />
    </div>
  );
}
