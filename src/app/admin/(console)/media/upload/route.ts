import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { MediaError, saveMediaFiles } from "@/lib/media";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  const back = new URL("/admin/media", request.url);

  try {
    const { saved, skipped } = await saveMediaFiles(files);
    back.searchParams.set("uploaded", String(saved.length));
    if (skipped.length) back.searchParams.set("skipped", String(skipped.length));
  } catch (error) {
    back.searchParams.set("error", error instanceof MediaError ? error.message : "Upload failed.");
  }

  return NextResponse.redirect(back, 303);
}
