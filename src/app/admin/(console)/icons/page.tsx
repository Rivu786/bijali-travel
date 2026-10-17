import { IconCatalog } from "@/components/admin/icon-catalog";

export const instant = false;

export default function IconsAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Icons</h1>
        <p className="mt-1 text-sm text-muted">
          Each row is the icon and the exact name to paste into an Icon field.
        </p>
      </div>
      <IconCatalog />
    </div>
  );
}
