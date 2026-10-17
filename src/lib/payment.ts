import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { mediaSrc } from "@/lib/media-path";
import { clipPayment, paymentDefaults, type PaymentCopy } from "@/lib/payment-copy";

function readyCopy(row: PaymentCopy) {
  const copy = clipPayment(row);
  return {
    ...copy,
    journeyLabel: copy.journeyLabel === "Selected journey" ? "Destination" : copy.journeyLabel,
    qrImage: mediaSrc(copy.qrImage),
  };
}

export async function getPaymentContent(): Promise<PaymentCopy> {
  await connection();
  const existing = await prisma.paymentContent.findUnique({ where: { id: 1 } });
  if (existing) return readyCopy(existing);
  try {
    const created = await prisma.paymentContent.create({ data: { id: 1, ...paymentDefaults } });
    return readyCopy(created);
  } catch {
    const again = await prisma.paymentContent.findUnique({ where: { id: 1 } });
    return readyCopy(again ?? paymentDefaults);
  }
}
