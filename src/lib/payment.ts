import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { clipPayment, paymentDefaults, type PaymentCopy } from "@/lib/payment-copy";

export async function getPaymentContent(): Promise<PaymentCopy> {
  await connection();
  const existing = await prisma.paymentContent.findUnique({ where: { id: 1 } });
  if (existing) return clipPayment(existing);
  try {
    const created = await prisma.paymentContent.create({ data: { id: 1, ...paymentDefaults } });
    return clipPayment(created);
  } catch {
    const again = await prisma.paymentContent.findUnique({ where: { id: 1 } });
    return clipPayment(again ?? paymentDefaults);
  }
}
