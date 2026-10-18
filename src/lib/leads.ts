import { headers } from "next/headers";
import { loadProjectEnv } from "@/lib/load-env";
import { siteOrigin } from "@/lib/seo";

loadProjectEnv();

const DEFAULT_LEADS_URL = "https://app.1inalltravel.com/api/leads/submit";
const DEFAULT_INQUIRY_FORM = "F-20261018-7817";
const DEFAULT_PAYMENT_FORM = "F-20261018-3262";

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

/** Payment form F-20261018-3262 — form submission / email only (not lead-creating on 1inall). */
export type PaymentFormPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  pagePath?: string;
};

async function postTo1inall(formCode: string, data: Record<string, string>, pagePath?: string) {
  loadProjectEnv();
  const apiKey = process.env.INALL_API_KEY?.trim();
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

  const body = {
    formCode,
    data: {
      ...data,
      website_url: "",
    },
    metadata: {
      userAgent: h.get("user-agent") || "Next.js server action",
      timestamp: new Date().toISOString(),
      referrer: h.get("referer") || "",
      url: pageUrl,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
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
}

/** Home / Contact / floating — form purpose Lead capture (creates leadId). */
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
      // Documented lead-capture keys
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message,
      // Form builder field labels (F-20261018-7817)
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

/** Payment — same endpoint, form F-20261018-3262 (no lead; email / form submission only). */
export async function submitPaymentFormTo1inall(payload: PaymentFormPayload): Promise<void> {
  const formCode = process.env.INALL_PAYMENT_FORM_CODE?.trim() || DEFAULT_PAYMENT_FORM;
  await postTo1inall(
    formCode,
    {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
    },
    payload.pagePath,
  );
}
