import { headers } from "next/headers";
import { loadProjectEnv } from "@/lib/load-env";
import { siteOrigin } from "@/lib/seo";

loadProjectEnv();

const DEFAULT_LEADS_URL = "https://app.1inalltravel.com/api/leads/submit";
const DEFAULT_INQUIRY_FORM = "F-20261018-7817";
/** Submission-only payment form on 1inall (no CRM lead). */
const DEFAULT_PAYMENT_FORM = "F-20261018-3262";
/** Deployment public API key for server-to-server 1inall access (not for browser JS). */
const DEFAULT_API_KEY = "4Bz9kP2nX7qR8dL3aF1mT5cH6jV0wSgYx";

export type InquiryLeadPayload = {
  tripType: string;
  destination: string;
  country?: string;
  state?: string;
  name: string;
  email: string;
  phone: string;
  packageTier: string;
  preferredMonth: string;
  pagePath?: string;
};

export type PaymentSubmissionPayload = {
  destination: string;
  packageTier: string;
  preferredMonth: string;
  name: string;
  email: string;
  phone: string;
  travelDate?: string;
  amount: string;
  utr: string;
};

export type OneInAllSubmitResult = {
  submissionId?: string;
  leadId?: string;
  brandEmailSent?: boolean;
  customerEmailSent?: boolean;
};

async function postTo1inall(
  formCode: string,
  data: Record<string, string>,
  pagePath?: string,
  idempotencyKey?: string,
): Promise<OneInAllSubmitResult> {
  loadProjectEnv();
  const apiKey = process.env.INALL_API_KEY?.trim() || DEFAULT_API_KEY;
  if (!apiKey) {
    throw new Error("Missing INALL_API_KEY");
  }

  const url = process.env.INALL_LEADS_URL?.trim() || DEFAULT_LEADS_URL;
  const h = await headers();
  const origin = await siteOrigin();
  const path = pagePath?.trim() || "";
  const pageUrl = path
    ? `${origin}${path.startsWith("/") ? path : `/${path}`}`
    : h.get("referer") || origin;
  const key = idempotencyKey?.trim() || "";

  const body = {
    formCode,
    data: {
      ...data,
      website_url: "",
    },
    metadata: {
      userAgent: h.get("user-agent") || "Next.js server action",
      timestamp: new Date().toISOString(),
      referrer: pageUrl,
      url: pageUrl,
      source: "bijali-travels",
      ...(key ? { idempotencyKey: key } : {}),
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      // Helps 1inall treat payment posts as submission_only even if form_type drifts
      Referer: pageUrl.includes("/payment") ? pageUrl : `${origin}/payment`,
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text().catch(() => "");
  type ApiResponse = {
    success?: boolean;
    error?: string;
    leadId?: string;
    referenceId?: string;
    submissionId?: string;
    brandEmail?: { sent?: boolean; to?: string | null; error?: string };
    customerEmail?: { sent?: boolean; to?: string | null; error?: string };
  };
  let result: ApiResponse | null = null;
  try {
    result = text ? (JSON.parse(text) as ApiResponse) : null;
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(`1inall ${response.status}: ${text.slice(0, 300)}`);
  }
  if (result?.success === false) {
    throw new Error(result.error || "1inall rejected the submission");
  }

  return {
    submissionId: result?.submissionId,
    leadId: result?.leadId,
    brandEmailSent: result?.brandEmail?.sent,
    customerEmailSent: result?.customerEmail?.sent,
  };
}

/** Home / Contact / floating — Lead capture form (creates lead). */
export async function submitLeadTo1inall(payload: InquiryLeadPayload): Promise<void> {
  const formCode = process.env.INALL_FORM_CODE?.trim() || DEFAULT_INQUIRY_FORM;
  const message = [
    `Trip Type: ${payload.tripType}`,
    `Destination: ${payload.destination}`,
    payload.country ? `Country: ${payload.country}` : "",
    payload.state ? `State/Province: ${payload.state}` : "",
    `Package tier: ${payload.packageTier}`,
    `Preferred month: ${payload.preferredMonth}`,
  ]
    .filter(Boolean)
    .join(" | ");

  await postTo1inall(
    formCode,
    {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message,
      "Trip Type": payload.tripType,
      Destination: payload.destination,
      Country: payload.country?.trim() || "",
      "State/Province": payload.state?.trim() || "",
      Name: payload.name,
      Email: payload.email,
      "ph num": payload.phone,
      "package tire": payload.packageTier,
      "Prefered month": payload.preferredMonth,
    },
    payload.pagePath,
  );
}

/**
 * Payment portal — submission_only form on 1inall (archives + emails, no CRM lead).
 */
export async function submitPaymentTo1inall(
  payload: PaymentSubmissionPayload,
): Promise<OneInAllSubmitResult> {
  const formCode =
    process.env.INALL_PAYMENT_FORM_CODE?.trim() || DEFAULT_PAYMENT_FORM;
  const email = payload.email.trim().toLowerCase();
  const utr = payload.utr.trim();
  const idempotencyKey = [
    "payment",
    formCode,
    email,
    utr,
    payload.amount.trim(),
  ].join("|");

  return postTo1inall(
    formCode,
    {
      // Keep primary keys for 1inall customer-email extraction
      destination: payload.destination,
      tier: payload.packageTier,
      month: payload.preferredMonth,
      name: payload.name,
      email,
      phone: payload.phone,
      date: payload.travelDate?.trim() || "",
      amount: payload.amount,
      utr,
      Destination: payload.destination,
      "package tire": payload.packageTier,
      "Prefered month": payload.preferredMonth,
      Name: payload.name,
      "Guest name": payload.name,
      Email: email,
      "ph num": payload.phone,
      " Mobile": payload.phone,
      " Travel date": payload.travelDate?.trim() || "",
      "Amount transferred": payload.amount,
      "UTR / UPI reference": utr,
    },
    "/payment",
    idempotencyKey,
  );
}
