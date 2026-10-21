import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { legalLinks } from "@/components/legal-document";
import { conciergeFaqs } from "@/lib/concierge-faqs";
import { getHomeContent, getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/faq", {
    label: "Concierge FAQs",
    metaTitle: `Concierge FAQs · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "travel FAQ, booking help, visa, cancellation, Bijali Tours",
    metaDescription: `Answers from the ${profile.brandName} concierge on documents, payments, changes, cancellation, and data requests.`,
    ogImage: profile.logoUrl,
    sortOrder: 44,
  });
}

export default async function FaqPage() {
  const [profile, content] = await Promise.all([getSiteProfile(), getHomeContent()]);
  const published = content.faqs.map((item) => ({ question: item.question, answer: item.answer }));
  const extras = conciergeFaqs.filter(
    (item) => !published.some((row) => row.question === item.question),
  );

  return (
    <div className="mx-auto w-full max-w-[860px] px-4 py-16 md:px-8">
      <span className="eyebrow text-secondary">Concierge desk</span>
      <h1 className="display mt-3 mb-4">Concierge FAQs</h1>
      <p className="text-lg leading-relaxed text-muted">
        Practical answers for planning a {profile.brandName} trip. The written quotation and the Terms
        of Booking control if a package differs.
      </p>
      <nav aria-label="Policies" className="mt-8 flex flex-wrap gap-2">
        {legalLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              item.href === "/faq"
                ? "bg-ink text-white"
                : "bg-surface-container text-muted hover:text-on-surface"
            }`}
            aria-current={item.href === "/faq" ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10">
        <FaqList faqs={[...published, ...extras]} />
      </div>
      <p className="mt-10 text-sm text-muted">
        Still deciding? <Link href="/contact" className="font-semibold text-secondary hover:underline">Contact the desk</Link>
        {" "}or read the{" "}
        <Link href="/booking-terms" className="font-semibold text-secondary hover:underline">
          Terms of Booking
        </Link>
        .
      </p>
    </div>
  );
}
