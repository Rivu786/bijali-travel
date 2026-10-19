import { IconCatalog } from "@/components/admin/icon-catalog";
import { prisma } from "@/lib/db";

export const instant = false;

export default async function IconsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const query = await searchParams;
  const customIcons = await prisma.catalogIcon.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Icons</h1>
        <p className="mt-1 text-sm text-muted">
          Add Material Symbols names, then copy and paste them into any Icon field.
        </p>
      </div>
      <IconCatalog
        customIcons={customIcons.map((item) => ({ id: item.id, name: item.name }))}
        saved={Boolean(query.saved)}
        error={query.error}
      />
    </div>
  );
}
