import { LegalDocument } from "@/components/legal-document";
import { legalUpdated, termsSections } from "@/lib/legal-copy";
import { getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/terms", {
    label: "Terms and Conditions",
    metaTitle: `Terms & Conditions · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "terms and conditions, Bijali Tours, website terms, travel website",
    metaDescription: `Website terms for ${profile.brandName}, including acceptable use, grievances, and Indian law.`,
    ogImage: profile.logoUrl,
    sortOrder: 40,
  });
}

export default async function TermsPage() {
  const profile = await getSiteProfile();
  return (
    <LegalDocument
      current="/terms"
      eyebrow="Legal"
      title="Terms & Conditions"
      updated={legalUpdated}
      lede={`These terms cover use of the ${profile.brandName} website. Bookings are covered separately in the Terms of Booking, and personal data is covered in Privacy & Data Rights.`}
      sections={termsSections(profile)}
    />
  );
}
