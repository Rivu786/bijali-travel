import { PaymentForm } from "@/app/payment/payment-form";
import { formatPrice } from "@/lib/format";
import { paymentLines } from "@/lib/payment-copy";
import { getPaymentContent } from "@/lib/payment";
import { getPackageBySlug, getSiteProfile } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata() {
  const profile = await getSiteProfile();
  return pageMetadata("/payment", {
    label: "Payment",
    metaTitle: `Payment Portal · ${profile.brandName}`.slice(0, 255),
    metaKeywords: "tour payment, booking payment, Bijali Tours",
    metaDescription: `Secure payment portal for ${profile.brandName} bookings.`,
    ogImage: profile.logoUrl,
    sortOrder: 30,
  });
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const slug = typeof params.package === "string" ? params.package : "bali-tropical-bliss";
  const [tour, copy] = await Promise.all([getPackageBySlug(slug), getPaymentContent()]);
  const steps = paymentLines(copy.steps);

  return (
    <div className="bg-surface pb-24">
      <div className="mx-auto max-w-[1100px] px-4 pt-12 md:px-8">
        <p className="eyebrow mb-3 text-secondary">{copy.eyebrow}</p>
        <h1 className="headline mb-10">{copy.title}</h1>
        <ol className="mb-12 flex flex-wrap gap-6 text-sm font-semibold text-muted">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  index < 2 ? "bg-cyan text-white" : "bg-surface-high"
                }`}
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <PaymentForm
          title={tour?.title ?? "Selected journey"}
          duration={tour?.duration ?? ""}
          priceLabel={tour ? formatPrice(tour.price, tour.currency) : ""}
          copy={copy}
        />
      </div>
    </div>
  );
}
