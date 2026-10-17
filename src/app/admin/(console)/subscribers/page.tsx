import { prisma } from "@/lib/db";

export default async function SubscribersPage() {
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Subscribers</h1>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-muted">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="p-3">{row.email}</td>
                <td className="p-3">{row.createdAt.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="p-6 text-muted">No subscribers yet.</p> : null}
      </div>
    </div>
  );
}
