import Image from "next/image";
import Link from "next/link";
import { AffiliationBar } from "@/components/affiliation-bar";
import { Icon } from "@/components/icon";
import { SubscribeForm } from "@/components/subscribe-form";

export function SiteFooter({
  logoUrl,
  brandName,
  blurb,
  badges,
  popular,
  partners,
  subscribe,
}: {
  logoUrl: string;
  brandName: string;
  blurb: string;
  badges: { label: string; icon: string }[];
  popular: { label: string; href: string }[];
  partners: { name: string; caption: string; markKey: string | null; logoUrl?: string | null }[];
  subscribe: { eyebrow: string; title: string; body: string };
}) {
  return (
    <footer className="w-full text-slate-50">
      <AffiliationBar partners={partners} />
      <div className="bg-navy-2 pt-24 pb-16">
        <div className="mx-auto max-w-[1320px] px-4 md:px-8">
          <SubscribeForm eyebrow={subscribe.eyebrow} title={subscribe.title} body={subscribe.body} />

          <div className="grid grid-cols-1 gap-8 pb-16 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Image
                  alt={brandName}
                  src={logoUrl}
                  width={72}
                  height={36}
                  className="h-9 rounded object-contain"
                  style={{ width: "auto" }}
                  unoptimized
                />
                <span className="text-lg font-bold tracking-tight text-white uppercase">
                  Bijali <span className="text-cyan">Tours & Travels</span>
                </span>
              </div>
              <p className="mb-6 text-sm text-slate-400">{blurb}</p>
              <div className="flex flex-col gap-2 text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                {badges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2">
                    <Icon name={badge.icon} className="text-[16px] text-sky" />
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Popular Destinations</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {popular.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/payment" className="hover:text-white">
                    Payment Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Support & Legal</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/#faq" className="hover:text-white">
                    Concierge FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Terms of Booking
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Privacy & Data Rights
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-3 pt-6 text-center text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            © 2026 Bijali Tours & Travels Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
