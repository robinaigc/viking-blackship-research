import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "../../components/card";
import { getAdminSession } from "../../lib/auth/admin";
import { getAdminEmail, getSupabaseConfig } from "../../lib/supabase/config";
import { requestMagicLink } from "../actions";

type Props = { searchParams: Promise<{ sent?: string; error?: string }> };

const errorMessages: Record<string, string> = {
  "not-configured": "Supabase or ADMIN_EMAIL is not configured yet.",
  "not-authorized": "This email is not authorized to manage the site.",
  "rate-limited": "A sign-in email was requested recently. Wait about one minute, then try again.",
  "login-failed": "The login email could not be sent. Please try again.",
  "missing-code": "The login link is incomplete.",
  "registration-failed": "The administrator account could not be registered.",
};

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await getAdminSession()) redirect("/admin");
  const params = await searchParams;
  const configured = Boolean(getSupabaseConfig() && getAdminEmail());

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <Card>
        <section className="w-full max-w-md p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Viking Blackship</p>
          <h1 className="mt-4 font-display text-3xl text-zinc-100">Private publishing</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Enter the administrator email. A secure sign-in link will be sent to that address.
          </p>

          {params.sent ? (
            <p className="mt-6 rounded-lg border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-300">
              Check your email for the sign-in link.
            </p>
          ) : null}
          {params.error ? (
            <p className="mt-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {errorMessages[params.error] ?? "Unable to sign in."}
            </p>
          ) : null}

          <form action={requestMagicLink} className="mt-8 space-y-4">
            <label className="block text-sm text-zinc-300" htmlFor="admin-email">
              Administrator email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={!configured}
              className="min-h-12 w-full rounded-lg border border-zinc-700 bg-black px-4 text-zinc-100 outline-none focus:border-zinc-300 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!configured}
              className="min-h-12 w-full rounded-lg border border-zinc-500 text-sm text-zinc-100 hover:border-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send secure login link
            </button>
          </form>
          <Link href="/" className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-200">
            Return to website
          </Link>
        </section>
      </Card>
    </main>
  );
}

