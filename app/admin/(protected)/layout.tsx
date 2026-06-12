import Link from "next/link";
import { requireAdmin } from "../../lib/auth/admin";
import { signOutAdmin } from "../actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-4">
          <Link href="/admin" className="font-display text-lg">Viking Blackship Admin</Link>
          <Link href="/admin/articles/new" className="text-sm text-zinc-400 hover:text-white">New article</Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">View website</Link>
          <span className="ml-auto hidden text-xs text-zinc-600 sm:block">{admin.email}</span>
          <form action={signOutAdmin}>
            <button type="submit" className="text-sm text-zinc-400 hover:text-white">Sign out</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}

