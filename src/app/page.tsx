import Image from "next/image";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { HeroSearch } from "@/components/hero-search";
import { Icon } from "@/components/icon";
import { InquiryForm } from "@/components/inquiry-form";
import { PackageCard } from "@/components/package-card";
import {
  covetedPackages,
  getHomeContent,
  getPublishedPackages,
  getSiteProfile,
  pickPlaced,
  recentPackages,
} from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const site = await getSiteProfile();
  return pageMetadata("/", {
    label: "Home",
    metaTitle: site.brandName,
    metaKeywords: "Bijali Tours, tour packages, domestic tours, international tours, weekend getaways",
    metaDescription: site.heroSubtitle,
    ogImage: site.heroImage || site.logoUrl,
    sortOrder: 0,
  });
}

export default async function Home() {
  const [site, content, packages] = await Promise.all([
    getSiteProfile(),
    getHomeContent(),
    getPublishedPackages(),
  ]);
  const featured = pickPlaced(content.placements, "coveted", packages) ?? covetedPackages(packages);
  const latest = pickPlaced(content.placements, "latest", packages) ?? recentPackages(packages);
  const distinction = content.section.distinction;
  const voyage = content.section.voyage;
  const coveted = content.section.coveted;
  const departures = content.section.departures;
  const privileges = content.section.privileges;
  const inquiry = content.section.inquiry;
  const impressions = content.section.testimonials;
  const faq = content.section.faq;
  const newest = latest[0]?.createdAt
    ? new Date(latest[0].createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "just now";

  return (
    <div className="flex w-full flex-col">
      <section className="relative -mt-20 flex min-h-[860px] items-center justify-center overflow-hidden">
        <Image
          src={site.heroImage}
          alt="Luxury coastline at golden hour"
          fill
          priority
          className="scale-105 object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-surface" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 pt-36 pb-16 text-center md:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
            <span className="eyebrow text-white">{site.heroEyebrow}</span>
          </div>
          <h1 className="display mb-4 max-w-4xl text-white">{site.heroTitle}</h1>
          <p className="mb-12 max-w-2xl text-lg text-slate-200">{site.heroSubtitle}</p>
          <HeroSearch />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-24 md:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="eyebrow mb-2 block text-secondary">{distinction?.eyebrow}</span>
          <h2 className="headline mb-3">{distinction?.title}</h2>
          <p className="text-muted">{distinction?.body}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.features.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col rounded-xl bg-surface-lowest p-8 shadow-sm hover:shadow-md"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/20 text-cyan transition-transform group-hover:scale-110">
                <Icon name={item.icon} className="text-[28px]" filled />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-surface-low py-24">
        <div className="mx-auto max-w-[1320px] px-4 md:px-8">
          <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="eyebrow mb-2 block text-secondary">{voyage?.eyebrow}</span>
              <h2 className="headline">{voyage?.title}</h2>
            </div>
            <p className="max-w-md text-muted">{voyage?.body}</p>
          </div>
          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-12 right-16 left-16 hidden h-0.5 bg-surface-highest lg:block" />
            {content.steps.map((step) => (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-start rounded-xl bg-surface-lowest p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan text-xl font-semibold text-white shadow-md">
                  {step.stepNo}
                </div>
                <h4 className="mb-1 text-lg font-semibold">{step.title}</h4>
                <p className="text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-24 md:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-2 block text-secondary">{coveted?.eyebrow}</span>
            <h2 className="headline">{coveted?.title}</h2>
          </div>
          <Link
            href="/packages"
            className="flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
          >
            Explore all itineraries <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((tour) => (
            <PackageCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-cyan/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1320px] px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow mb-2 block text-sky">{inquiry?.eyebrow}</span>
              <h2 className="headline mb-4 text-white">{inquiry?.title}</h2>
              <p className="mb-8 text-slate-300">{inquiry?.body}</p>
              <div className="space-y-4">
                {content.points.map((point) => (
                  <div key={point.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/30 text-sky">
                      <Icon name="verified" className="text-[18px]" />
                    </div>
                    <span className="text-sm text-slate-200">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-surface-lowest p-8 text-on-surface shadow-xl lg:col-span-7">
              <InquiryForm page="/" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-24 md:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-2 block text-secondary">{departures?.eyebrow}</span>
            <h2 className="headline">{departures?.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-sky" />
            <span className="eyebrow text-muted">Updated {newest}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {latest.map((tour) => (
            <PackageCard key={tour.slug} tour={tour} variant="latest" />
          ))}
        </div>
      </section>

      <section className="w-full bg-surface-low py-24">
        <div className="mx-auto max-w-[1320px] px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-12 rounded-xl bg-surface-lowest p-8 shadow-sm lg:flex-row lg:p-12">
            <div className="max-w-xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold tracking-wider text-red-800 uppercase">
                  {privileges?.eyebrow}
                </span>
                <div className="flex items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-[11px] font-bold tracking-wider text-secondary uppercase">
                  <Icon name="timer" className="text-[15px]" /> Seasonal offer
                </div>
              </div>
              <h2 className="headline mb-4">{privileges?.title}</h2>
              <p className="mb-6 text-muted">{privileges?.body}</p>
              <div className="mb-8 flex flex-wrap gap-2.5">
                {content.perks.map((perk) => (
                  <span
                    key={perk.id}
                    className="flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase"
                  >
                    <Icon name="check_circle" className="text-[15px] text-secondary" />
                    {perk.label}
                  </span>
                ))}
              </div>
              <Link
                href="/packages?tag=special"
                className="inline-flex rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-white shadow-md"
              >
                {privileges?.ctaLabel || "Claim Special Package"}
              </Link>
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg lg:h-96 lg:w-1/2">
              <Image
                src={privileges?.imageUrl || site.heroImage}
                alt={privileges?.imageAlt || ""}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-white">
                <span className="eyebrow mb-1 block text-sky">{privileges?.captionEyebrow}</span>
                <h4 className="text-xl font-semibold">{privileges?.caption}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-16 md:px-8">
        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-xl bg-black p-8 text-white shadow-xl lg:flex-row lg:p-12">
          <div className="z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-cyan">
              <Image src={site.advisorImage} alt="Travel advisor" fill className="object-cover" unoptimized />
            </div>
            <div>
              <span className="eyebrow mb-1 block text-sky">{site.advisorEyebrow}</span>
              <h3 className="mb-2 text-2xl font-bold">{site.advisorTitle}</h3>
              <p className="max-w-xl text-sm text-slate-200">{site.advisorBody}</p>
            </div>
          </div>
          <div className="z-10 flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
            <a
              href={site.whatsapp}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white sm:w-auto"
            >
              <Icon name="chat" className="text-[20px]" /> WhatsApp Advisor
            </a>
            <a
              href={`tel:${site.phoneTel}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-6 py-3.5 text-sm font-semibold text-white sm:w-auto"
            >
              <Icon name="call" className="text-[20px]" /> {site.phoneAlt}
            </a>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-low py-24">
        <div className="mx-auto max-w-[1320px] px-4 md:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="eyebrow mb-2 block text-secondary">{impressions?.eyebrow}</span>
            <h2 className="headline mb-3">{impressions?.title}</h2>
            <p className="text-muted">{impressions?.body}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {content.testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-xl bg-surface-lowest p-8 shadow-sm"
              >
                <div>
                  <div className="mb-4 flex items-center gap-1 text-amber">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Icon key={i} name="star" className="text-[18px]" filled />
                    ))}
                  </div>
                  <p className="mb-6 text-lg text-on-surface italic">“{t.quote}”</p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-high">
                    {t.imageUrl ? (
                      <Image src={t.imageUrl} alt={t.name} fill className="object-cover" unoptimized />
                    ) : null}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{t.name}</h4>
                    <span className="eyebrow block text-secondary">{t.tripLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-[1000px] px-4 py-24 md:px-8">
        <div className="mb-12 text-center">
          <span className="eyebrow mb-2 block text-secondary">{faq?.eyebrow}</span>
          <h2 className="headline mb-3">{faq?.title}</h2>
          <p className="text-muted">{faq?.body}</p>
        </div>
        <FaqList faqs={content.faqs} />
      </section>
    </div>
  );
}
