import { LegalDocument } from "@/components/legal-document";
import { gdprSections, legalUpdated } from "@/lib/legal-copy";
import { getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/gdpr", {
    label: "GDPR",
    metaTitle: `GDPR Notice · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "GDPR, UK GDPR, data subject rights, international transfer, Bijali Tours",
    metaDescription: `GDPR and UK GDPR notice for ${profile.brandName}, including legal bases, international transfers, and data-subject rights.`,
    ogImage: profile.logoUrl,
    sortOrder: 42,
  });
}

export default async function GdprPage() {
  const profile = await getSiteProfile();
  return (
    <LegalDocument
      current="/gdpr"
      eyebrow="European & UK privacy"
      title="GDPR"
      updated={legalUpdated}
      lede="If you are in the European Economic Area, the United Kingdom, or Switzerland, this page is the extra notice required by the GDPR and the UK GDPR. Our India notice remains the Privacy & Data Rights page."
      sections={gdprSections(profile)}
    />
  );
}
