import Link from "next/link";
import { Icon } from "@/components/icon";
import { PackageBrowser } from "@/app/packages/package-browser";
import { getPublishedPackages, getHomeContent, getSiteProfile, pickPlaced } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getSiteProfile();
  return pageMetadata("/packages", {
    label: "Tour packages",
    metaTitle: `Tour Packages · ${site.brandName}`.slice(0, 255),
    metaKeywords: "tour packages, domestic holidays, international tours, weekend trips, Bijali Tours",
    metaDescription: `Explore curated national and international tour packages from ${site.brandName}.`,
    ogImage: site.heroImage || site.logoUrl,
    sortOrder: 10,
  });
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, packages, content] = await Promise.all([
    searchParams,
    getPublishedPackages(),
    getHomeContent(),
  ]);
  const tier = typeof params.tier === "string" ? params.tier : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const special = tag === "special" ? pickPlaced(content.placements, "special", packages) ?? [] : null;
  const listed = special ?? packages;

  return (
    <div className="bg-surface-low pb-24">
      <section className="bg-gradient-to-b from-ink to-ink/90 px-4 pt-16 pb-20 text-white md:px-8">
        <div className="mx-auto max-w-[1320px]">
          <p className="mb-3 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            / Packages
          </p>
          <h1 className="display mb-4">Explore Curated Tour Packages</h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Handpicked journeys by Bijali Tours & Travels — luxury, heritage, and
            immersive experiences in India and worldwide, tailored to your style.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="-mt-8">
          {special && special.length === 0 ? (
            <p className="rounded-xl bg-white p-8 text-center text-muted shadow-sm">
              No special packages are selected yet.
            </p>
          ) : (
            <PackageBrowser
              packages={listed}
              initialTier={tier}
              initialQuery={q}
              initialCategory={category}
              initialTag={special ? undefined : tag}
            />
          )}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-xl bg-ink p-8 text-white md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Can&apos;t find your ideal destination?</h2>
            <p className="text-slate-300">
              Tell us your dates and party size. We&apos;ll craft a private itinerary in 24
              hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 font-semibold"
          >
            Talk to a specialist <Icon name="arrow_forward" />
          </Link>
        </div>
      </div>
    </div>
  );
}
