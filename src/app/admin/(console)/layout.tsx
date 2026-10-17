import { Suspense } from "react";
import { redirect } from "next/navigation";
import { logout, purgeCache } from "@/app/actions/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { isAdmin } from "@/lib/admin-session";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="bg-surface-low text-on-surface">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_minmax(0,1fr)] md:px-6">
      <aside className="h-fit rounded-xl bg-white p-4 shadow-sm md:sticky md:top-24 md:max-h-[calc(100dvh-7rem)] md:overflow-y-auto">
        <p className="eyebrow mb-3 text-secondary">Admin</p>
        <Suspense fallback={<p className="px-3 text-sm text-muted">Loading menu…</p>}>
          <AdminNav />
        </Suspense>
        <form action={purgeCache} className="mt-4">
          <button className="w-full rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white">
            Purge cache
          </button>
        </form>
        <form action={logout} className="mt-2">
          <button className="w-full rounded-lg bg-surface-high px-3 py-2 text-sm font-semibold">
            Log out
          </button>
        </form>
      </aside>
      <div id="admin-scroll" className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
