"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { submitLeadTo1inall } from "@/lib/leads";

/** Honeypot field name — avoid website/url so browsers do not autofill it. */
const HONEYPOT = "company_fax";

export async function submitInquiry(_prev: { ok: boolean; message: string }, formData: FormData) {
  const honeypot = String(formData.get(HONEYPOT) ?? "").trim();
  if (honeypot) {
    return {
      ok: true,
      message: "Callback request saved. A Bijali travel specialist will connect within 24 hours.",
    };
  }

  const fullName = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const preferredMonth = String(formData.get("month") ?? "").trim();
  const tier = String(formData.get("tier") ?? "Deluxe").trim();
  const tripType = String(formData.get("tripType") ?? "Domestic").trim();
  const country = String(formData.get("country") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const pagePath = String(formData.get("page") ?? "").trim();

  if (!fullName || !phone || !email || !destination) {
    return { ok: false, message: "Please complete every required field." };
  }

  await prisma.tripInquiry.create({
    data: { fullName, phone, email, destination, preferredMonth, tier },
  });
  revalidatePath("/admin/inquiries");

  try {
    await submitLeadTo1inall({
      tripType: tripType === "International" ? "International" : "Domestic",
      destination,
      country,
      state,
      name: fullName,
      email,
      phone,
      packageTier: tier,
      preferredMonth,
      pagePath,
    });
  } catch (error) {
    console.error("[1inall] inquiry sync failed", error);
  }

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

export async function submitPayment(_prev: { ok: boolean; message: string }, formData: FormData) {
  const honeypot = String(formData.get(HONEYPOT) ?? "").trim();
  if (honeypot) {
    return { ok: true, message: "Payment form request saved" };
  }

  const guestName = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();
  const utr = String(formData.get("utr") ?? "").trim();

  if (!guestName || !mobile || !email || !amount || !utr) {
    return { ok: false, message: "Please complete every required field." };
  }

  // Payment never calls 1inall /api/leads/submit — that endpoint always creates a lead row.
  // Home/Contact/floating still create leads via submitInquiry.
  return { ok: true, message: "Payment form request saved" };
}
