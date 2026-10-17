import { PackageForm } from "@/components/admin/package-form";
import { prisma } from "@/lib/db";

export default async function NewPackagePage() {
  const [groups, tags] = await Promise.all([
    prisma.menuGroup.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">New package</h1>
      <PackageForm tour={null} groups={groups} tags={tags} />
    </div>
  );
}
