import Link from "next/link";

export const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy & Data Rights" },
  { href: "/gdpr", label: "GDPR" },
  { href: "/booking-terms", label: "Terms of Booking" },
  { href: "/faq", label: "Concierge FAQs" },
] as const;

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export function LegalDocument({
  eyebrow,
  title,
  updated,
  lede,
  current,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  lede: string;
  current: string;
  sections: LegalSection[];
}) {
  return (
    <article className="mx-auto w-full max-w-[860px] px-4 py-16 md:px-8">
      <span className="eyebrow text-secondary">{eyebrow}</span>
      <h1 className="display mt-3 mb-4">{title}</h1>
      <p className="text-sm text-muted">Last updated {updated}</p>
      <p className="mt-6 text-lg leading-relaxed text-muted">{lede}</p>

      <nav aria-label="Policies" className="mt-8 flex flex-wrap gap-2">
        {legalLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              item.href === current
                ? "bg-ink text-white"
                : "bg-surface-container text-muted hover:text-on-surface"
            }`}
            aria-current={item.href === current ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <ol className="mt-8 space-y-2 border-y border-surface-high py-5 text-sm">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="text-secondary hover:underline">
              {index + 1}. {section.title}
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-10 space-y-10">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              {index + 1}. {section.title}
            </h2>
            <div className="space-y-4 text-[15px] leading-7 text-muted">
              {section.blocks.map((block, blockIndex) =>
                block.type === "p" ? (
                  <p key={blockIndex}>{block.text}</p>
                ) : (
                  <ul key={blockIndex} className="list-disc space-y-2 pl-5">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
