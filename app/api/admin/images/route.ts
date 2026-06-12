import { NextResponse } from "next/server";
import { getAdminSession } from "../../../lib/auth/admin";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Use JPEG, PNG, or WebP images." }, { status: 415 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });

  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${admin.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("article-images").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = supabase.storage.from("article-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
