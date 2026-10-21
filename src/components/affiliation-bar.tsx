import Image from "next/image";

function PartnerCard({
  name,
  caption,
  logoUrl,
}: {
  name: string;
  caption: string;
  logoUrl?: string | null;
}) {
  return (
    <li
      className="flex h-[128px] w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm"
      title={caption ? `${name} — ${caption}` : name}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={160}
          height={56}
          className="h-14 w-auto object-contain"
          style={{ width: "auto", height: "3.5rem" }}
          unoptimized
        />
      ) : null}
      <span className="line-clamp-2 text-[11px] font-bold tracking-wide text-navy-2 uppercase">{name}</span>
    </li>
  );
}

export function AffiliationBar({
  partners,
}: {
  partners: { name: string; caption: string; logoUrl?: string | null }[];
}) {
  const loop = [...partners, ...partners];

  return (
    <section className="w-full overflow-hidden bg-surface-low py-16">
      <h2 className="mb-12 scroll-mt-32 text-center text-[22px] font-extrabold tracking-[0.18em] uppercase">
        <span className="text-navy-2">Affiliation</span>{" "}
        <span className="text-amber">&amp; Partners</span>
      </h2>
      <div className="affiliate-marquee" aria-label="Affiliation and partner logos">
        <ul className="affiliate-track flex w-max list-none gap-5 px-3">
          {loop.map((partner, index) => (
            <PartnerCard
              key={`${partner.name}-${index}`}
              name={partner.name}
              caption={partner.caption}
              logoUrl={partner.logoUrl}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
