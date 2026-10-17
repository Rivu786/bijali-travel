"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function submitInquiry(_prev: { ok: boolean; message: string }, formData: FormData) {
  const fullName = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const preferredMonth = String(formData.get("month") ?? "").trim();
  const tier = String(formData.get("tier") ?? "Deluxe").trim();
  if (!fullName || !phone || !email || !destination) {
    return { ok: false, message: "Please complete every required field." };
  }
  await prisma.tripInquiry.create({
    data: { fullName, phone, email, destination, preferredMonth, tier },
  });
  revalidatePath("/admin/inquiries");
  return {
    ok: true,
    message: "Callback request saved. A Bijali travel specialist will connect within 24 hours.",
  };
}

export async function subscribe(_prev: { ok: boolean; message: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Enter a valid email address." };
  }
  await prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  revalidatePath("/admin/subscribers");
  return { ok: true, message: "You are on the list. Watch your inbox for private departures." };
}
