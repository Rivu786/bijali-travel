import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { PackageCard } from "@/components/package-card";
import { formatPrice, stayCategoryLabel } from "@/lib/format";
import { getPackageBySlug, getPublishedPackages, relatedPackages } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getPackageBySlug(slug);
  if (!tour) return { title: "Package" };
  return pageMetadata(`/packages/${tour.slug}`, {
    label: tour.title,
    metaTitle: `${tour.title} · Bijali Tours & Travels`.slice(0, 255),
    metaKeywords: `${tour.title}, tour package, Bijali Tours & Travels`,
    metaDescription: tour.summary,
    ogImage: tour.image,
    sortOrder: 100,
    packageId: tour.id,
  });
}

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tour, packages] = await Promise.all([getPackageBySlug(slug), getPublishedPackages()]);
  if (!tour) notFound();

  const related = relatedPackages(tour, packages, 3);

  return (
    <div className="bg-surface pb-24">
      <div className="mx-auto max-w-[1320px] px-4 pt-8 md:px-8">
        <p className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-cyan">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/packages" className="hover:text-cyan">
            Packages
          </Link>{" "}
          / <span className="text-on-surface">{tour.title}</span>
        </p>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative mb-6 h-[420px] overflow-hidden rounded-xl">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              {tour.gallery.map((src) => (
                <div key={src} className="relative h-28 overflow-hidden rounded-lg">
                  <Image src={src} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
            <span className="eyebrow text-secondary">{tour.tier} • {tour.duration}</span>
            <h1 className="headline mt-2 mb-4">{tour.title}</h1>
            <p className="mb-10 text-lg text-muted">{tour.summary}</p>

            <h2 className="mb-6 text-2xl font-bold">Complete Tailored Tour Itinerary</h2>
            <ol className="mb-12 space-y-4">
              {tour.itinerary.map((day) => (
                <li
                  key={day.day}
                  className="rounded-xl border border-surface-high bg-white p-5 shadow-sm"
                >
                  <p className="eyebrow mb-1 text-cyan">{day.day}</p>
                  <h3 className="mb-1 text-lg font-semibold">{day.title}</h3>
                  <p className="text-sm text-muted">{day.body}</p>
                </li>
              ))}
            </ol>

            <h2 className="mb-6 text-2xl font-bold">Accommodation</h2>
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tour.stays.map((stay) => (
                <div
                  key={stay.name}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  <div className="relative h-40">
                    <Image src={stay.image} alt={stay.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="p-4">
                    <p className="eyebrow mb-1 text-cyan">{stayCategoryLabel(stay.category)}</p>
                    <h3 className="font-semibold">{stay.name}</h3>
                    <p className="text-sm text-muted">{stay.place}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">What&apos;s Included</h3>
                <ul className="space-y-2 text-sm">
                  {tour.inclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Icon name="check_circle" className="text-[18px] text-cyan" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">What&apos;s Excluded</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {tour.exclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Icon name="cancel" className="text-[18px] text-outline" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-xl bg-white p-6 shadow-lg lg:sticky lg:top-24">
            <p className="eyebrow mb-1 text-muted">From</p>
            <p className="mb-1 text-3xl font-extrabold">
              {formatPrice(tour.price)}
              <span className="text-sm font-normal text-muted"> / person</span>
            </p>
            {tour.originalPrice ? (
              <p className="mb-4 text-sm text-outline line-through">
                {formatPrice(tour.originalPrice)}
              </p>
            ) : (
              <div className="mb-4" />
            )}
            <div className="mb-6 flex items-center gap-1 text-sm">
              <Icon name="star" className="text-[16px] text-amber" filled />
              {tour.rating} ({tour.reviews} reviews)
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold">
                Travel date
                <input className="input mt-1" type="date" name="date" />
              </label>
              <label className="block text-sm font-semibold">
                Guests
                <select className="input mt-1" name="guests" defaultValue="2">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </label>
              <Link
                href={`/payment?package=${tour.slug}`}
                className="block w-full rounded-lg bg-cyan py-3 text-center font-semibold text-white"
              >
                Reserve this journey
              </Link>
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-surface-high py-3 text-center font-semibold"
              >
                Request custom quote
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <h2 className="mb-8 text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((p) => (
              <PackageCard key={p.slug} tour={p} />
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-xl bg-ink p-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Need a tailor-made variation?</h2>
            <p className="text-slate-300">
              Swap hotels, add a night, or include private aviation — we&apos;ll reprice
              within a day.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-lg bg-cyan px-6 py-3 font-semibold text-white"
          >
            Speak with Bijali
          </Link>
        </div>
      </div>
    </div>
  );
}
