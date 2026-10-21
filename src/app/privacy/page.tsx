import { LegalDocument } from "@/components/legal-document";
import { legalUpdated, privacySections } from "@/lib/legal-copy";
import { getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/privacy", {
    label: "Privacy and Data Rights",
    metaTitle: `Privacy & Data Rights · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "privacy policy, DPDP Act, data principal rights, Bijali Tours",
    metaDescription: `How ${profile.brandName} collects, uses, and shares personal data, and how to use your rights under India’s DPDP Act.`,
    ogImage: profile.logoUrl,
    sortOrder: 41,
  });
}

export default async function PrivacyPage() {
  const profile = await getSiteProfile();
  return (
    <LegalDocument
      current="/privacy"
      eyebrow="Privacy"
      title="Privacy & Data Rights"
      updated={legalUpdated}
      lede="This notice explains what we collect when you enquire, pay, or subscribe, why we use it, and how to access, correct, or erase it under the Digital Personal Data Protection Act, 2023. Visitors in the EU, EEA, or UK should also read the GDPR page."
      sections={privacySections(profile)}
    />
  );
}
