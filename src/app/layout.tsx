import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { siteOrigin } from "@/lib/seo";
import { FloatingInquiry } from "@/components/floating-inquiry";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getHomeContent,
  getNav,
  getPublishedPackages,
  getSiteProfile,
  pickPlaced,
  popularPackages,
} from "@/lib/queries";
import "./globals.css";

export const instant = false;

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(await siteOrigin()),
    title: {
      default: "Bijali Tours & Travels",
      template: "%s · Bijali Tours & Travels",
    },
    description:
      "Curated national and international tour packages from Bijali Tours & Travels — IATA and Ministry of Tourism certified.",
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteProfile();
  const content = await getHomeContent();
  const packages = await getPublishedPackages();
  const nav = await getNav();
  const popular = (pickPlaced(content.placements, "popular", packages) ?? popularPackages(packages)).map((tour) => ({
    label: tour.title,
    href: `/packages/${tour.slug}`,
  }));

  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="flex min-h-full flex-col bg-surface font-sans text-on-surface">
        <SiteHeader
          logoUrl={site.logoUrl}
          brandName={site.brandName}
          shortName={site.shortName}
          domestic={nav.domestic}
          weekend={nav.weekend}
          international={nav.international}
        />
        <main className="flex flex-1 flex-col pt-20">{children}</main>
        <SiteFooter
          logoUrl={site.logoUrl}
          brandName={site.brandName}
          blurb={site.footerBlurb}
          badges={content.badges}
          popular={popular}
          partners={content.partners}
          subscribe={{
            eyebrow: site.subscribeEyebrow,
            title: site.subscribeTitle,
            body: site.subscribeBody,
          }}
        />
        <FloatingInquiry />
      </body>
    </html>
  );
}
