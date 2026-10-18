import { headers } from "next/headers";
import { loadProjectEnv } from "@/lib/load-env";
import { siteOrigin } from "@/lib/seo";

loadProjectEnv();

const DEFAULT_LEADS_URL = "https://app.1inalltravel.com/api/leads/submit";

/** Inquiry form field labels for formCode F-20261018-7817. */
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

export async function submitLeadTo1inall(payload: InquiryLeadPayload): Promise<void> {
  const apiKey = process.env.INALL_API_KEY?.trim();
  const formCode = process.env.INALL_FORM_CODE?.trim();
  if (!apiKey || !formCode) {
    console.error("[1inall] Missing INALL_API_KEY or INALL_FORM_CODE");
    return;
  }

  const url = process.env.INALL_LEADS_URL?.trim() || DEFAULT_LEADS_URL;
  const h = await headers();
  const origin = await siteOrigin();
  const pagePath = payload.pagePath?.trim() || "";
  const pageUrl = pagePath
    ? `${origin}${pagePath.startsWith("/") ? pagePath : `/${pagePath}`}`
    : h.get("referer") || origin;

  const body = {
    formCode,
    data: {
      "Trip Type": payload.tripType,
      Destination: payload.destination,
      Country: payload.country?.trim() || "",
      "State/Province": payload.state?.trim() || "",
      Name: payload.name,
      Email: payload.email,
      "ph num": payload.phone,
      "package tire": payload.packageTier,
      "Prefered month": payload.preferredMonth,
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

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`1inall ${response.status}: ${text.slice(0, 300)}`);
  }

  const result = (await response.json().catch(() => null)) as
    | { success?: boolean; error?: string }
    | null;
  if (result && result.success === false) {
    throw new Error(result.error || "1inall rejected the lead");
  }
}
