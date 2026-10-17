import { Icon } from "@/components/icon";

const brandMarks = new Set(["iata", "ssl", "mot", "toab", "adtoi"]);

function PartnerCard({
  name,
  caption,
  mark,
}: {
  name: string;
  caption: string;
  mark: React.ReactNode;
}) {
  return (
    <li
      className="flex h-[128px] w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm"
      title={caption ? `${name} — ${caption}` : name}
    >
      {mark}
      <span className="line-clamp-2 text-[11px] font-bold tracking-wide text-navy-2 uppercase">{name}</span>
    </li>
  );
}

function markFor(key: string | null) {
  if (key === "iata") {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden>
        <circle cx="36" cy="36" r="32" fill="none" stroke="#1d4ed8" strokeWidth="3" />
        <circle cx="36" cy="36" r="24" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
        <text
          x="36"
          y="41"
          textAnchor="middle"
          fill="#1d4ed8"
          fontSize="14"
          fontWeight="800"
          fontFamily="var(--font-jakarta), sans-serif"
        >
          IATA
        </text>
      </svg>
    );
  }
  if (key === "ssl") {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden>
        <path
          d="M36 8 14 18v20c0 16 9.5 26 22 30 12.5-4 22-14 22-30V18L36 8Z"
          fill="#16a34a"
        />
        <path
          d="M28 36.5 33.5 42 46 29"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (key === "mot") {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden>
        <rect x="10" y="10" width="52" height="52" rx="8" fill="#0f172a" />
        <path d="M36 18 44 34H28L36 18Z" fill="#f59e0b" />
        <rect x="22" y="38" width="28" height="16" rx="2" fill="#fff" />
        <text
          x="36"
          y="50"
          textAnchor="middle"
          fill="#0f172a"
          fontSize="9"
          fontWeight="800"
          fontFamily="var(--font-jakarta), sans-serif"
        >
          MOT
        </text>
      </svg>
    );
  }
  if (key === "toab") {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden>
        <text
          x="36"
          y="46"
          textAnchor="middle"
          fill="#15803d"
          fontSize="22"
          fontWeight="800"
          fontFamily="var(--font-jakarta), sans-serif"
        >
          ToA
        </text>
        <path d="M12 54h48" stroke="#15803d" strokeWidth="2" />
      </svg>
    );
  }
  if (key === "adtoi") {
    return (
      <svg viewBox="0 0 96 40" className="h-10 w-24" aria-hidden>
        <text
          x="48"
          y="28"
          textAnchor="middle"
          fill="#ea580c"
          fontSize="18"
          fontWeight="700"
          letterSpacing="1"
          fontFamily="var(--font-jakarta), sans-serif"
        >
          adtoi
        </text>
      </svg>
    );
  }
  return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden>
        <circle cx="36" cy="28" r="10" fill="#f97316" />
        <path d="M20 58c4-14 12-20 16-20s12 6 16 20" fill="#1d4ed8" />
        <path d="M28 22c8-10 20-6 22 4" fill="none" stroke="#16a34a" strokeWidth="3" />
      </svg>
    );
}

export function AffiliationBar({
  partners,
}: {
  partners: { name: string; caption: string; markKey: string | null; logoUrl?: string | null }[];
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
              mark={
                partner.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.logoUrl} alt="" className="h-14 w-auto" />
                ) : partner.markKey && !brandMarks.has(partner.markKey) ? (
                  <Icon name={partner.markKey} className="text-[40px] text-cyan" />
                ) : (
                  markFor(partner.markKey)
                )
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
