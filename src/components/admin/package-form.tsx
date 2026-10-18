import { deletePackage, savePackage } from "@/app/actions/admin";
import { PackageLists } from "@/components/admin/package-lists";
import type { Category, MenuGroup, Package, Tag, Tier } from "@prisma/client";

type EditorPackage = Package & {
  gallery: { imageUrl: string }[];
  itinerary: { dayLabel: string; title: string; body: string }[];
  items: { kind: "inclusion" | "exclusion"; label: string }[];
  stays: { name: string; place: string; imageUrl: string | null; category: string }[];
  tags: { tag: { slug: string } }[];
};

export function PackageForm({
  tour,
  groups,
  tags,
}: {
  tour: EditorPackage | null;
  groups: MenuGroup[];
  tags: Tag[];
}) {
  const selected = new Set(tour?.tags.map((item) => item.tag.slug) ?? []);
  return (
    <form action={savePackage} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <input type="hidden" name="id" value={tour?.id ?? ""} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={tour?.title} required />
        <Field label="Slug" name="slug" defaultValue={tour?.slug} required />
        <label className="text-sm font-semibold">
          Category
          <select className="input mt-1" name="category" defaultValue={tour?.category ?? "domestic"}>
            {(["weekend", "domestic", "international"] as Category[]).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Menu group
          <select className="input mt-1" name="groupId" defaultValue={tour?.groupId ?? ""}>
            <option value="">None</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </label>
        <Field label="State" name="state" defaultValue={tour?.state ?? ""} />
        <Field label="Location" name="location" defaultValue={tour?.location} />
        <label className="text-sm font-semibold">
          Tier
          <select className="input mt-1" name="tier" defaultValue={tierValue(tour?.tier)}>
            <option>Standard</option>
            <option>Deluxe</option>
            <option>Super Deluxe</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Status
          <select className="input mt-1" name="status" defaultValue={tour?.status ?? "published"}>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
        <Field label="Duration" name="duration" defaultValue={tour?.duration} />
        <Field label="Nights" name="nights" defaultValue={String(tour?.nights ?? 0)} />
        <Field label="Days" name="days" defaultValue={String(tour?.days ?? 0)} />
        <Field label="Price (₹)" name="price" defaultValue={tour ? String(tour.price) : ""} />
        <Field label="Original price (₹)" name="originalPrice" defaultValue={tour?.originalPrice ? String(tour.originalPrice) : ""} />
        <input type="hidden" name="currency" value="INR" />
        <Field label="Rating" name="rating" defaultValue={tour ? String(tour.rating) : "4.8"} />
        <Field label="Reviews" name="reviewCount" defaultValue={String(tour?.reviewCount ?? 0)} />
        <Field label="Latest badge" name="latestBadge" defaultValue={tour?.latestBadge ?? ""} />
        <Field label="Image URL" name="imageUrl" defaultValue={tour?.imageUrl} />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Tags</legend>
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="tags" value={tag.slug} defaultChecked={selected.has(tag.slug)} />
              {tag.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Area label="Summary" name="summary" defaultValue={tour?.summary} />
      <PackageLists
        gallery={tour?.gallery.map((item) => item.imageUrl) ?? []}
        itinerary={tour?.itinerary.map((day) => ({ dayLabel: day.dayLabel, title: day.title, body: day.body })) ?? []}
        inclusions={tour?.items.filter((item) => item.kind === "inclusion").map((item) => item.label) ?? []}
        exclusions={tour?.items.filter((item) => item.kind === "exclusion").map((item) => item.label) ?? []}
        stays={
          tour?.stays.map((stay) => ({
            name: stay.name,
            place: stay.place,
            imageUrl: stay.imageUrl ?? "",
            category: stay.category,
          })) ?? []
        }
      />
      <div className="flex gap-3">
        <button className="rounded-lg bg-cyan px-5 py-2.5 text-sm font-semibold text-white">Save package</button>
      </div>
      {tour ? (
        <button formAction={deletePackage} className="text-sm font-semibold text-red-700">
          Delete package
        </button>
      ) : null}
    </form>
  );
}

function tierValue(tier?: Tier) {
  if (tier === "SuperDeluxe") return "Super Deluxe";
  return tier ?? "Deluxe";
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input className="input mt-1" name={name} defaultValue={defaultValue ?? ""} required={required} />
    </label>
  );
}

function Area({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <textarea className="input mt-1 min-h-28" name={name} defaultValue={defaultValue ?? ""} />
    </label>
  );
}
