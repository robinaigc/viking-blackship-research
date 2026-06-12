"use client";

import { useEffect } from "react";
import { getAuthCallbackCredentials } from "../../../lib/auth/callback.mjs";
import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";

export default function AdminAuthCallbackPage() {
  useEffect(() => {
    let active = true;

    async function completeLogin() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        window.location.replace("/admin/login?error=not-configured");
        return;
      }

      const credentials = getAuthCallbackCredentials(window.location.href);
      let error = null;

      if (credentials.kind === "code") {
        ({ error } = await supabase.auth.exchangeCodeForSession(credentials.code));
      } else if (credentials.kind === "otp") {
        ({ error } = await supabase.auth.verifyOtp({
          token_hash: credentials.tokenHash,
          type: credentials.type,
        }));
      } else if (credentials.kind === "session") {
        ({ error } = await supabase.auth.setSession({
          access_token: credentials.accessToken,
          refresh_token: credentials.refreshToken,
        }));
      } else {
        window.location.replace("/admin/login?error=missing-code");
        return;
      }

      if (!active) return;
      if (error) {
        await supabase.auth.signOut();
        window.location.replace("/admin/login?error=invalid-link");
        return;
      }

      window.location.replace("/admin/auth/finalize");
    }

    void completeLogin();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-sm text-zinc-400">
      Completing secure sign-in...
    </main>
  );
}
