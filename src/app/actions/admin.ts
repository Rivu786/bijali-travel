"use server";

import { revalidatePath } from "next/cache";
import * as nextCache from "next/cache";
import { redirect } from "next/navigation";
import type { Category, InquiryStatus, PublishStatus } from "@prisma/client";
import { assertAdmin, clearAdminCookie, setAdminCookie, credentialsMatch } from "@/lib/admin-session";
import { prisma } from "@/lib/db";
import { stayCategoryEnum, tierEnum } from "@/lib/format";
import { deleteMediaFile } from "@/lib/media";
import { clipPayment, paymentDefaults, type PaymentCopy } from "@/lib/payment-copy";
import { syncPackageSeo } from "@/lib/seo";

function revalidateSite() {
  revalidatePath("/", "layout");
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listValues(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function alignedRows(formData: FormData, names: string[]) {
  const columns = names.map((name) => formData.getAll(name).map((value) => String(value).trim()));
  const length = Math.max(0, ...columns.map((column) => column.length));
  return Array.from({ length }, (_, index) => columns.map((column) => column[index] ?? ""));
}

export async function login(_prev: { error: string }, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!credentialsMatch(username, password)) {
    return { error: "Those details do not match." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

export async function purgeCache() {
  await assertAdmin();
  revalidatePath("/", "layout");
  for (const path of ["/", "/packages", "/contact", "/about", "/payment"]) {
    revalidatePath(path);
  }
  nextCache.refresh();
  redirect("/admin?purged=1");
}

export async function saveSettings(formData: FormData) {
  await assertAdmin();
  const text = (name: string) => String(formData.get(name) ?? "");
  await prisma.siteSetting.update({
    where: { id: 1 },
    data: {
      brandName: text("brandName"),
      shortName: text("shortName"),
      email: text("email"),
      phone: text("phone"),
      phoneAlt: text("phoneAlt"),
      phoneTel: text("phoneTel"),
      whatsapp: text("whatsapp"),
      logoUrl: text("logoUrl"),
      heroEyebrow: text("heroEyebrow"),
      heroTitle: text("heroTitle"),
      heroSubtitle: text("heroSubtitle"),
      heroImage: text("heroImage"),
      advisorEyebrow: text("advisorEyebrow"),
      advisorTitle: text("advisorTitle"),
      advisorBody: text("advisorBody"),
      advisorImage: text("advisorImage"),
      footerBlurb: text("footerBlurb"),
      subscribeEyebrow: text("subscribeEyebrow"),
      subscribeTitle: text("subscribeTitle"),
      subscribeBody: text("subscribeBody"),
    },
  });
  revalidateSite();
  redirect("/admin/content?saved=settings");
}

export async function saveSection(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const text = (name: string) => String(formData.get(name) ?? "") || null;
  const data: {
    eyebrow?: string | null;
    title?: string;
    body?: string | null;
    imageUrl?: string | null;
    imageAlt?: string | null;
    captionEyebrow?: string | null;
    caption?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
  } = {};
  if (formData.has("eyebrow")) data.eyebrow = text("eyebrow");
  if (formData.has("title")) data.title = String(formData.get("title") ?? "");
  if (formData.has("body")) data.body = text("body");
  if (formData.has("imageUrl")) data.imageUrl = text("imageUrl");
  if (formData.has("imageAlt")) data.imageAlt = text("imageAlt");
  if (formData.has("captionEyebrow")) data.captionEyebrow = text("captionEyebrow");
  if (formData.has("caption")) data.caption = text("caption");
  if (formData.has("ctaLabel")) data.ctaLabel = text("ctaLabel");
  if (formData.has("ctaHref")) data.ctaHref = text("ctaHref");
  await prisma.homeSection.update({ where: { slug }, data });
  revalidateSite();
  redirectBack(formData, "/admin/homepage");
}

function redirectBack(formData: FormData, fallback: string) {
  const back = String(formData.get("back") ?? fallback);
  const safe = back.startsWith("/admin") ? back : fallback;
  const url = new URL(safe, "http://local");
  url.searchParams.set("saved", "1");
  redirect(`${url.pathname}${url.search}`);
}

function orderedRows(formData: FormData, names: string[]) {
  return alignedRows(formData, names)
    .map((row, index) => ({ row, index, order: Number(row[0]) || index + 1 }))
    .filter(({ row }) => row.slice(1).some(Boolean))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ row, order }) => ({ row, order }));
}

export async function saveLines(formData: FormData) {
  await assertAdmin();
  const kind = String(formData.get("kind") ?? "");
  const rows = lines(formData.get("rows"));
  if (kind === "features") {
    await prisma.homeFeature.deleteMany();
    await prisma.homeFeature.createMany({
      data: rows.map((row, sortOrder) => {
        const [icon, title, body] = row.split("|").map((part) => part.trim());
        return { icon: icon || "star", title: title || "Untitled", body: body || "", sortOrder };
      }),
    });
  } else if (kind === "steps") {
    await prisma.homeStep.deleteMany();
    await prisma.homeStep.createMany({
      data: rows.map((row, sortOrder) => {
        const [stepNo, title, body] = row.split("|").map((part) => part.trim());
        return { stepNo: stepNo || String(sortOrder + 1).padStart(2, "0"), title: title || "", body: body || "", sortOrder };
      }),
    });
  } else if (kind === "perks") {
    await prisma.offerPerk.deleteMany();
    await prisma.offerPerk.createMany({ data: rows.map((label, sortOrder) => ({ label, sortOrder })) });
  } else if (kind === "points") {
    await prisma.inquiryPoint.deleteMany();
    await prisma.inquiryPoint.createMany({ data: rows.map((label, sortOrder) => ({ label, sortOrder })) });
  } else if (kind === "badges") {
    await prisma.footerBadge.deleteMany();
    await prisma.footerBadge.createMany({
      data: rows.map((row, sortOrder) => {
        const [label, icon] = row.split("|").map((part) => part.trim());
        return { label: label || "Badge", icon: icon || "verified", sortOrder };
      }),
    });
  } else if (kind === "partners") {
    await prisma.partner.deleteMany();
    await prisma.partner.createMany({
      data: rows.map((row, sortOrder) => {
        const [name, caption, markKey] = row.split("|").map((part) => part.trim());
        return { name: name || "Partner", caption: caption || "", markKey: markKey || null, sortOrder };
      }),
    });
  } else if (kind === "faqs") {
    await prisma.faq.deleteMany();
    await prisma.faq.createMany({
      data: rows.map((row, sortOrder) => {
        const [question, answer] = row.split("|").map((part) => part.trim());
        return { question: question || "Question", answer: answer || "", sortOrder };
      }),
    });
  } else if (kind === "testimonials") {
    await prisma.testimonial.deleteMany();
    await prisma.testimonial.createMany({
      data: rows.map((row, sortOrder) => {
        const [name, tripLabel, quote, imageUrl] = row.split("|").map((part) => part.trim());
        return { name: name || "Guest", tripLabel: tripLabel || "", quote: quote || "", imageUrl: imageUrl || null, sortOrder };
      }),
    });
  }
  revalidateSite();
  redirect("/admin/content?saved=lines");
}

export async function savePackage(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id") || 0);
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!slug || !title) redirect("/admin/packages?error=missing");
  const category = String(formData.get("category") ?? "domestic") as Category;
  const groupId = Number(formData.get("groupId") || 0);
  const tagSlugs = formData.getAll("tags").map(String);
  const tags = await prisma.tag.findMany({ where: { slug: { in: tagSlugs } } });
  const data = {
    slug,
    title,
    category,
    groupId: groupId || null,
    state: String(formData.get("state") ?? "") || null,
    location: String(formData.get("location") ?? ""),
    tier: tierEnum(String(formData.get("tier") ?? "Deluxe")),
    duration: String(formData.get("duration") ?? ""),
    nights: Number(formData.get("nights") || 0),
    days: Number(formData.get("days") || 0),
    price: Number(formData.get("price") || 0),
    originalPrice: String(formData.get("originalPrice") ?? "")
      ? Number(formData.get("originalPrice"))
      : null,
    currency: String(formData.get("currency") ?? "INR").replace(/^USD$/i, "INR") || "INR",
    rating: Number(formData.get("rating") || 0),
    reviewCount: Number(formData.get("reviewCount") || 0),
    summary: String(formData.get("summary") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    latestBadge: String(formData.get("latestBadge") ?? "") || null,
    status: (String(formData.get("status") ?? "published") || "published") as PublishStatus,
  };
  const saved = id
    ? await prisma.package.update({ where: { id }, data })
    : await prisma.package.create({ data });
  await prisma.packageTag.deleteMany({ where: { packageId: saved.id } });
  await prisma.packageGallery.deleteMany({ where: { packageId: saved.id } });
  await prisma.packageItinerary.deleteMany({ where: { packageId: saved.id } });
  await prisma.packageItem.deleteMany({ where: { packageId: saved.id } });
  await prisma.packageStay.deleteMany({ where: { packageId: saved.id } });
  if (tags.length) {
    await prisma.packageTag.createMany({
      data: tags.map((tag) => ({ packageId: saved.id, tagId: tag.id })),
    });
  }
  const gallery = listValues(formData, "gallery");
  if (gallery.length) {
    await prisma.packageGallery.createMany({
      data: gallery.map((imageUrl, sortOrder) => ({
        packageId: saved.id,
        imageUrl,
        sortOrder,
      })),
    });
  }
  const itinerary = alignedRows(formData, ["itineraryDay", "itineraryTitle", "itineraryBody"]).filter((row) =>
    row.some(Boolean),
  );
  if (itinerary.length) {
    await prisma.packageItinerary.createMany({
      data: itinerary.map(([dayLabel, dayTitle, body], sortOrder) => ({
        packageId: saved.id,
        dayLabel: dayLabel || `Day ${sortOrder + 1}`,
        title: dayTitle || "Day",
        body: body || "",
        sortOrder,
      })),
    });
  }
  const inclusions = listValues(formData, "inclusions");
  const exclusions = listValues(formData, "exclusions");
  const items = [
    ...inclusions.map((label, sortOrder) => ({
      packageId: saved.id,
      kind: "inclusion" as const,
      label,
      sortOrder,
    })),
    ...exclusions.map((label, sortOrder) => ({
      packageId: saved.id,
      kind: "exclusion" as const,
      label,
      sortOrder,
    })),
  ];
  if (items.length) await prisma.packageItem.createMany({ data: items });
  const stays = alignedRows(formData, ["stayName", "stayPlace", "stayImage", "stayCategory"]).filter(([name, place, imageUrl]) =>
    [name, place, imageUrl].some(Boolean),
  );
  if (stays.length) {
    await prisma.packageStay.createMany({
      data: stays.map(([name, place, imageUrl, category], sortOrder) => ({
        packageId: saved.id,
        name: name || "Accommodation",
        place: place || "",
        imageUrl: imageUrl || null,
        category: stayCategoryEnum(category),
        sortOrder,
      })),
    });
  }
  await syncPackageSeo({
    id: saved.id,
    slug: saved.slug,
    title: saved.title,
    summary: saved.summary,
    imageUrl: saved.imageUrl,
  });
  revalidateSite();
  revalidatePath(`/packages/${saved.slug}`);
  redirect(`/admin/packages/${saved.id}?saved=1`);
}

export async function saveSeo(formData: FormData) {
  await assertAdmin();
  const path = String(formData.get("path") ?? "");
  if (!path.startsWith("/")) redirect("/admin/seo");
  await prisma.pageSeo.update({
    where: { path },
    data: {
      metaTitle: String(formData.get("metaTitle") ?? "").slice(0, 255),
      metaKeywords: String(formData.get("metaKeywords") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      ogImage: String(formData.get("ogImage") ?? "").slice(0, 500),
    },
  });
  revalidatePath(path);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/seo?saved=${encodeURIComponent(path)}`);
}

export async function deleteMedia(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id") || 0);
  if (id) await deleteMediaFile(id);
  revalidatePath("/admin/media");
}

export async function deletePackage(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id") || 0);
  if (id) await prisma.package.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/packages");
}

export async function saveBanner(formData: FormData) {
  await assertAdmin();
  const text = (name: string) => String(formData.get(name) ?? "");
  await prisma.siteSetting.update({
    where: { id: 1 },
    data: {
      brandName: text("brandName"),
      shortName: text("shortName"),
      logoUrl: text("logoUrl"),
      heroEyebrow: text("heroEyebrow"),
      heroTitle: text("heroTitle"),
      heroSubtitle: text("heroSubtitle"),
      heroImage: text("heroImage"),
    },
  });
  revalidateSite();
  redirectBack(formData, "/admin/homepage?section=banner");
}

export async function saveAdvisor(formData: FormData) {
  await assertAdmin();
  const text = (name: string) => String(formData.get(name) ?? "");
  await prisma.siteSetting.update({
    where: { id: 1 },
    data: {
      advisorEyebrow: text("advisorEyebrow"),
      advisorTitle: text("advisorTitle"),
      advisorBody: text("advisorBody"),
      advisorImage: text("advisorImage"),
      whatsapp: text("whatsapp"),
      phone: text("phone"),
      phoneAlt: text("phoneAlt"),
      phoneTel: text("phoneTel"),
      email: text("email"),
    },
  });
  revalidateSite();
  redirectBack(formData, "/admin/homepage?section=advisor");
}

export async function savePayment(formData: FormData) {
  await assertAdmin();
  const text = (name: keyof PaymentCopy) => String(formData.get(name) ?? paymentDefaults[name]);
  const data = clipPayment({
    eyebrow: text("eyebrow"),
    title: text("title"),
    steps: text("steps"),
    formTitle: text("formTitle"),
    journeyLabel: text("journeyLabel"),
    guestLabel: text("guestLabel"),
    mobileLabel: text("mobileLabel"),
    emailLabel: text("emailLabel"),
    dateLabel: text("dateLabel"),
    amountLabel: text("amountLabel"),
    referenceLabel: text("referenceLabel"),
    uploadLabel: text("uploadLabel"),
    submitLabel: text("submitLabel"),
    successMessage: text("successMessage"),
    privacyNote: text("privacyNote"),
    transferEyebrow: text("transferEyebrow"),
    qrImage: text("qrImage"),
    accountNameLabel: text("accountNameLabel"),
    accountName: text("accountName"),
    bankLabel: text("bankLabel"),
    bankName: text("bankName"),
    accountNoLabel: text("accountNoLabel"),
    accountNo: text("accountNo"),
    ifscLabel: text("ifscLabel"),
    ifsc: text("ifsc"),
    upiLabel: text("upiLabel"),
    upi: text("upi"),
    instructionsTitle: text("instructionsTitle"),
    instructions: text("instructions"),
  });
  await prisma.paymentContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  revalidatePath("/payment");
  redirect("/admin/payment?saved=1");
}

export async function saveFooterCopy(formData: FormData) {
  await assertAdmin();
  const text = (name: string) => String(formData.get(name) ?? "");
  await prisma.siteSetting.update({
    where: { id: 1 },
    data: {
      footerBlurb: text("footerBlurb"),
      subscribeEyebrow: text("subscribeEyebrow"),
      subscribeTitle: text("subscribeTitle"),
      subscribeBody: text("subscribeBody"),
    },
  });
  revalidateSite();
  redirectBack(formData, "/admin/footer");
}

export async function saveRepeatable(formData: FormData) {
  await assertAdmin();
  const kind = String(formData.get("kind") ?? "");
  if (kind === "features") {
    const rows = orderedRows(formData, ["sort", "icon", "title", "body"]);
    await prisma.homeFeature.deleteMany();
    if (rows.length) {
      await prisma.homeFeature.createMany({
        data: rows.map(({ row, order }) => ({
          icon: row[1] || "star",
          title: row[2] || "Untitled",
          body: row[3] || "",
          sortOrder: order,
        })),
      });
    }
  } else if (kind === "steps") {
    const rows = orderedRows(formData, ["sort", "stepNo", "title", "body"]);
    await prisma.homeStep.deleteMany();
    if (rows.length) {
      await prisma.homeStep.createMany({
        data: rows.map(({ row, order }, index) => ({
          stepNo: row[1] || String(index + 1).padStart(2, "0"),
          title: row[2] || "",
          body: row[3] || "",
          sortOrder: order,
        })),
      });
    }
  } else if (kind === "perks") {
    const rows = orderedRows(formData, ["sort", "label"]);
    await prisma.offerPerk.deleteMany();
    if (rows.length) {
      await prisma.offerPerk.createMany({
        data: rows.map(({ row, order }) => ({ label: row[1], sortOrder: order })),
      });
    }
  } else if (kind === "points") {
    const rows = orderedRows(formData, ["sort", "label"]);
    await prisma.inquiryPoint.deleteMany();
    if (rows.length) {
      await prisma.inquiryPoint.createMany({
        data: rows.map(({ row, order }) => ({ label: row[1], sortOrder: order })),
      });
    }
  } else if (kind === "badges") {
    const rows = orderedRows(formData, ["sort", "label", "icon"]);
    await prisma.footerBadge.deleteMany();
    if (rows.length) {
      await prisma.footerBadge.createMany({
        data: rows.map(({ row, order }) => ({
          label: row[1] || "Badge",
          icon: row[2] || "verified",
          sortOrder: order,
        })),
      });
    }
  } else if (kind === "partners") {
    const rows = orderedRows(formData, ["sort", "markKey", "name", "caption"]);
    await prisma.partner.deleteMany();
    if (rows.length) {
      await prisma.partner.createMany({
        data: rows.map(({ row, order }) => ({
          markKey: row[1] || null,
          name: row[2] || "Partner",
          caption: row[3] || "",
          sortOrder: order,
        })),
      });
    }
  } else if (kind === "faqs") {
    const rows = orderedRows(formData, ["sort", "question", "answer"]);
    await prisma.faq.deleteMany();
    if (rows.length) {
      await prisma.faq.createMany({
        data: rows.map(({ row, order }) => ({
          question: row[1] || "Question",
          answer: row[2] || "",
          sortOrder: order,
        })),
      });
    }
  } else if (kind === "testimonials") {
    const rows = orderedRows(formData, ["sort", "name", "tripLabel", "quote", "imageUrl"]);
    await prisma.testimonial.deleteMany();
    if (rows.length) {
      await prisma.testimonial.createMany({
        data: rows.map(({ row, order }) => ({
          name: row[1] || "Guest",
          tripLabel: row[2] || "",
          quote: row[3] || "",
          imageUrl: row[4] || null,
          sortOrder: order,
        })),
      });
    }
  }
  revalidateSite();
  redirectBack(formData, "/admin/homepage");
}

export async function savePlacements(formData: FormData) {
  await assertAdmin();
  const slot = String(formData.get("slot") ?? "");
  const allowed = new Set(["coveted", "latest", "special", "popular", "weekend"]);
  if (!allowed.has(slot)) redirect("/admin");
  const ids = formData.getAll("packageId").map((value) => Number(value));
  const orders = formData.getAll("sortOrder").map((value) => String(value).trim());
  const data = ids.flatMap((packageId, index) => {
    if (!packageId || orders[index] === "") return [];
    const sortOrder = Number(orders[index]);
    if (!Number.isFinite(sortOrder)) return [];
    return [{ slot, packageId, sortOrder }];
  });
  await prisma.homePlacement.deleteMany({ where: { slot } });
  if (data.length) await prisma.homePlacement.createMany({ data });
  revalidateSite();
  redirectBack(formData, "/admin/homepage");
}

export async function saveMenuGroup(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || "travel_explore";
  const category = String(formData.get("category") ?? "domestic") as Category;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const tab = category === "international" ? "international" : "domestic";
  if (!title) redirect(`/admin/menus?tab=${tab}&error=name`);
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "group"}-${Date.now().toString(36)}`;
  const group = id
    ? await prisma.menuGroup.update({ where: { id }, data: { title, icon, category, sortOrder } })
    : await prisma.menuGroup.create({ data: { slug, title, icon, category, sortOrder } });
  const selected = formData
    .getAll("packageId")
    .map((value) => Number(value))
    .filter(Boolean);
  await prisma.package.updateMany({
    where: { groupId: group.id, ...(selected.length ? { id: { notIn: selected } } : {}) },
    data: { groupId: null },
  });
  if (selected.length) {
    await prisma.package.updateMany({ where: { id: { in: selected } }, data: { groupId: group.id } });
  }
  revalidateSite();
  redirect(`/admin/menus?tab=${tab}&saved=1`);
}

export async function deleteMenuGroup(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id") || 0);
  const category = String(formData.get("category") ?? "domestic");
  if (id) {
    await prisma.package.updateMany({ where: { groupId: id }, data: { groupId: null } });
    await prisma.menuGroup.delete({ where: { id } });
  }
  revalidateSite();
  redirect(`/admin/menus?tab=${category}&saved=1`);
}

export async function setInquiryStatus(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id") || 0);
  const status = String(formData.get("status") ?? "new") as InquiryStatus;
  if (id) await prisma.tripInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
}
