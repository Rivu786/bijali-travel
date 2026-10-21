import { LegalDocument } from "@/components/legal-document";
import { bookingSections, legalUpdated } from "@/lib/legal-copy";
import { getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/booking-terms", {
    label: "Terms of Booking",
    metaTitle: `Terms of Booking · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "booking terms, cancellation policy, tour refund, Bijali Tours",
    metaDescription: `How ${profile.brandName} confirms, changes, and cancels a tour, including refunds and supplier charges.`,
    ogImage: profile.logoUrl,
    sortOrder: 43,
  });
}

export default async function BookingTermsPage() {
  const profile = await getSiteProfile();
  return (
    <LegalDocument
      current="/booking-terms"
      eyebrow="Bookings"
      title="Terms of Booking"
      updated={legalUpdated}
      lede="These terms apply once you accept a written quotation. They sit alongside the Consumer Protection Act, 2019 and explain payment, changes, cancellation, and what happens if a supplier or the weather intervenes."
      sections={bookingSections(profile)}
    />
  );
}
