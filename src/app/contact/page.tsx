import { InquiryForm } from "@/components/inquiry-form";
import { getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/contact", {
    label: "Contact",
    metaTitle: `Contact · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "contact Bijali Tours, travel enquiry, tour booking, helpline",
    metaDescription: `Contact ${profile.brandName} for a tailored tour proposal, bookings, and round-the-clock support.`,
    ogImage: profile.logoUrl,
    sortOrder: 20,
  });
}

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
      <div>
        <span className="eyebrow text-secondary">Concierge desk</span>
        <h1 className="display mt-3 mb-6">Contact Bijali</h1>
        <p className="mb-6 text-muted">
          Share your dates and we will return a tailored proposal. For urgent
          amendments on an existing booking, call the 24/7 helpline.
        </p>
        <ul className="space-y-3 text-sm">
          <li>
            <strong>Helpline:</strong> {site.phone}
          </li>
          <li>
            <strong>Email:</strong> {site.email}
          </li>
          <li>
            <strong>Hours:</strong> 24/7 operations desk
          </li>
        </ul>
      </div>
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <InquiryForm />
      </div>
    </div>
  );
}
