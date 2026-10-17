import { setInquiryStatus } from "@/app/actions/admin";
import { prisma } from "@/lib/db";

export default async function InquiriesPage() {
  const rows = await prisma.tripInquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Callback requests</h1>
      <p className="mb-6 text-sm text-muted">These come from the Plan Your Custom Trip form on the homepage.</p>
      <div className="space-y-4">
        {rows.length === 0 ? <p className="text-muted">No callback requests yet.</p> : null}
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{row.fullName}</h2>
                <p className="text-sm text-muted">
                  {row.email} · {row.phone}
                </p>
              </div>
              <p className="text-xs text-muted">{row.createdAt.toLocaleString("en-IN")}</p>
            </div>
            <p className="mt-3 text-sm">
              {row.destination} · {row.preferredMonth} · {row.tier}
            </p>
            <form action={setInquiryStatus} className="mt-3 flex items-center gap-2">
              <input type="hidden" name="id" value={row.id} />
              <select className="input h-10 w-40" name="status" defaultValue={row.status}>
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="closed">closed</option>
              </select>
              <button className="rounded-lg bg-surface-high px-3 py-2 text-sm font-semibold">Update</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
