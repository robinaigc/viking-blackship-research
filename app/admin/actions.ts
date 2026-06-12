"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminEmail, getSupabaseConfig } from "../lib/supabase/config";
import { createSupabaseServerClient } from "../lib/supabase/server";

export async function requestMagicLink(formData: FormData) {
  const config = getSupabaseConfig();
  const adminEmail = getAdminEmail();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!config || !adminEmail) redirect("/admin/login?error=not-configured");
  if (email !== adminEmail) redirect("/admin/login?error=not-authorized");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=not-configured");
  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/admin/auth/callback`,
      shouldCreateUser: true,
    },
  });
  if (error) redirect("/admin/login?error=login-failed");
  redirect("/admin/login?sent=1");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
