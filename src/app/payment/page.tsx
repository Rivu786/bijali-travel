import { PaymentForm } from "@/app/payment/payment-form";
import { formatPrice } from "@/lib/format";
import { getPackageBySlug } from "@/lib/queries";

export const metadata = {
  title: "Payment Portal",
};

export const instant = false;

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const slug = typeof params.package === "string" ? params.package : "bali-tropical-bliss";
  const tour = await getPackageBySlug(slug);

  return (
    <div className="bg-surface pb-24">
      <div className="mx-auto max-w-[1100px] px-4 pt-12 md:px-8">
        <p className="eyebrow mb-3 text-secondary">Secure checkout</p>
        <h1 className="headline mb-10">Bijali Tours & Travels Secure Payment Portal</h1>
        <ol className="mb-12 flex flex-wrap gap-6 text-sm font-semibold text-muted">
          {["Select booking", "Transfer details", "Upload proof", "Confirmed"].map(
            (step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                    i < 2 ? "bg-cyan text-white" : "bg-surface-high"
                  }`}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ),
          )}
        </ol>
        <PaymentForm
          title={tour?.title ?? "Selected journey"}
          duration={tour?.duration ?? ""}
          priceLabel={tour ? formatPrice(tour.price, tour.currency) : ""}
        />
      </div>
    </div>
  );
}
