import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { MediaError, saveMediaFiles } from "@/lib/media";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const back = new URL("/admin/media", request.url);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    back.searchParams.set("error", "That upload is too large. Keep each file under 8 MB.");
    return NextResponse.redirect(back, 303);
  }
  const files = form.getAll("files").filter((item): item is File => item instanceof File);

  try {
    const { saved, skipped } = await saveMediaFiles(files);
    back.searchParams.set("uploaded", String(saved.length));
    if (skipped.length) back.searchParams.set("skipped", String(skipped.length));
  } catch (error) {
    back.searchParams.set("error", error instanceof MediaError ? error.message : "Upload failed.");
  }

  return NextResponse.redirect(back, 303);
}
