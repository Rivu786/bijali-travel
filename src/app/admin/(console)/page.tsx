import Link from "next/link";
import { purgeCache } from "@/app/actions/admin";
import { prisma } from "@/lib/db";

export const instant = false;

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ purged?: string }>;
}) {
  const query = await searchParams;
  const [packages, inquiries, subscribers] = await Promise.all([
    prisma.package.count(),
    prisma.tripInquiry.count({ where: { status: "new" } }),
    prisma.subscriber.count(),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Overview</h1>
        <form action={purgeCache}>
          <button className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white">
            Purge cache
          </button>
        </form>
      </div>
      {query.purged ? (
        <p className="mb-4 rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm">
          Cache cleared. The public site will load fresh content.
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Packages", packages, "/admin/packages"],
          ["Callback requests", inquiries, "/admin/inquiries"],
          ["Subscribers", subscribers, "/admin/subscribers"],
        ].map(([label, value, href]) => (
          <Link key={String(href)} href={String(href)} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-muted">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
