import { PaymentEditor } from "@/components/admin/payment-editor";
import { prisma } from "@/lib/db";
import { mediaPath } from "@/lib/media";
import { getPaymentContent } from "@/lib/payment";

export const instant = false;

export default async function PaymentAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const query = await searchParams;
  const [content, media] = await Promise.all([
    getPaymentContent(),
    prisma.mediaAsset.findMany({
      where: { mimeType: { startsWith: "image/" } },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment page</h1>
        <p className="mt-1 text-sm text-muted">
          Edit the checkout heading, form labels, bank details, QR image, and fulfillment steps shown on the payment page.
        </p>
      </div>
      {query.saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Saved.
        </p>
      ) : null}
      <PaymentEditor content={content} images={media.map((item) => mediaPath(item.filename))} />
    </div>
  );
}
