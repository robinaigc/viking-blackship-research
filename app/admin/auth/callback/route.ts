import { NextResponse } from "next/server";
import { registerAdminUser } from "../../../lib/auth/admin";
import { getAdminEmail } from "../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const otpType = url.searchParams.get("type");
  const destination = new URL("/admin", url.origin);
  if (!code && (!tokenHash || !["magiclink", "signup"].includes(otpType ?? ""))) {
    return NextResponse.redirect(new URL("/admin/login?error=missing-code", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(new URL("/admin/login?error=not-configured", url.origin));
  const { data, error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash as string,
        type: otpType as "magiclink" | "signup",
      });
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
  return NextResponse.redirect(destination);
}
