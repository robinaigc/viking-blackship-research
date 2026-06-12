import { NextResponse } from "next/server";
import { registerAdminUser } from "../../../lib/auth/admin";
import { getAdminEmail } from "../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/admin/login?error=not-configured", url.origin));
  }

  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (error || !data.user || !email || email !== getAdminEmail()) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/admin/login?error=not-authorized", url.origin));
  }

  try {
    const registered = await registerAdminUser(data.user.id, email);
    if (!registered) throw new Error("Admin registration is not configured.");
  } catch {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/admin/login?error=registration-failed", url.origin));
  }

  return NextResponse.redirect(new URL("/admin", url.origin));
}
