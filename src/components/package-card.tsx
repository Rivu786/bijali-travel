import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { formatPrice } from "@/lib/format";
import type { TourPackage } from "@/lib/types";

export function PackageCard({
  tour,
  variant = "grid",
}: {
  tour: TourPackage;
  variant?: "grid" | "latest";
}) {
  const href = `/packages/${tour.slug}`;
  const tierClass =
    tour.tier === "Super Deluxe"
      ? "bg-amber/80 text-[#2a1700]"
      : tour.tier === "Deluxe"
        ? "bg-white/80 text-secondary"
        : "bg-surface-high/80 text-muted";

  if (variant === "latest") {
    return (
      <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-lowest shadow-sm transition-all hover:shadow-md">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            New Departure
          </div>
          {tour.latestBadge ? (
            <div className="absolute bottom-3 left-3 rounded-md bg-white/80 px-2.5 py-1 text-[11px] font-bold tracking-wider text-on-surface uppercase backdrop-blur-md">
              {tour.latestBadge}
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-secondary uppercase">
                {tour.days}D / {tour.nights}N • {tour.location}
              </span>
              <span className="rounded bg-surface-high px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                {tour.tier}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">{tour.title}</h3>
            <p className="mb-4 text-sm text-muted">{tour.summary}</p>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-xl font-bold">
              {formatPrice(tour.price)}{" "}
              <span className="text-[11px] font-normal text-outline uppercase">
                / pers.
              </span>
            </span>
            <Link
              href={href}
              className="flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
            >
              View Itinerary <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-lowest shadow-sm transition-all hover:shadow-md">
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div
          className={`absolute top-3 left-3 flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md ${tierClass}`}
        >
          {tour.tier === "Super Deluxe" ? (
            <Icon name="auto_awesome" className="text-[13px]" filled />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          )}
          {tour.tier === "Standard" ? "Standard Signature" : `${tour.tier} Escapes`}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-ink/80 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
          <Icon
            name="star"
            className="text-[13px] text-amber"
            filled
          />
          {tour.rating.toFixed(1)} ({tour.reviews} reviews)
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-bold tracking-wider text-outline uppercase">
            <Icon name="schedule" className="text-[14px]" /> {tour.duration} •{" "}
            {tour.location}
          </div>
          <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-secondary">
            {tour.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted">{tour.summary}</p>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            {tour.originalPrice ? (
              <span className="block text-[11px] font-bold tracking-wider text-outline line-through uppercase">
                {formatPrice(tour.originalPrice)}
              </span>
            ) : null}
            <span className="text-xl font-bold">
              {formatPrice(tour.price)}{" "}
              <span className="text-[11px] font-normal text-muted uppercase">
                / pers.
              </span>
            </span>
          </div>
          <Link
            href={href}
            className="rounded-lg bg-surface-high px-3.5 py-2 text-xs font-semibold transition-all hover:bg-secondary hover:text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
