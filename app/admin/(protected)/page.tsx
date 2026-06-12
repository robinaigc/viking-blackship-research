import Link from "next/link";
import { requireAdmin } from "../../lib/auth/admin";
import { mapArticleRow, type ArticleRow } from "../../lib/articles/repository";
import { createSupabaseServerClient } from "../../lib/supabase/server";

type Props = { searchParams: Promise<{ deleted?: string }> };

export const metadata = { title: "Article Admin", robots: { index: false, follow: false } };

export default async function AdminHome({ searchParams }: Props) {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;
  const { data, error } = supabase
    ? await supabase
        .from("articles")
        .select("*")
        .eq("owner_id", admin.id)
        .order("updated_at", { ascending: false })
    : { data: null, error: new Error("Supabase is not configured.") };
  const articles = error ? [] : (data as ArticleRow[]).map(mapArticleRow);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">Publishing dashboard</p>
          <h1 className="mt-3 font-display text-4xl">Articles</h1>
          <p className="mt-3 text-sm text-zinc-400">Write privately, save drafts, and publish directly to your website.</p>
        </div>
        <Link href="/admin/articles/new" className="rounded-lg border border-zinc-500 px-5 py-3 text-sm hover:border-white">
          New article
        </Link>
      </div>

      {params.deleted ? <p className="mt-8 rounded-lg border border-zinc-800 p-4 text-sm text-zinc-300">Article deleted.</p> : null}
      {error ? <p className="mt-8 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">{error.message}</p> : null}

      <div className="mt-10 overflow-hidden rounded-xl border border-zinc-800">
        {articles.length === 0 ? (
          <div className="p-10 text-center text-sm text-zinc-500">No articles yet. Create your first article.</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {articles.map((article) => (
              <Link key={article.id} href={`/admin/articles/${article.id}`} className="grid gap-3 p-5 hover:bg-zinc-900/70 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <h2 className="font-medium text-zinc-100">{article.title}</h2>
                  <p className="mt-1 text-xs text-zinc-600">/analysis/{article.slug}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs ${article.status === "published" ? "bg-emerald-950 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {article.status}
                </span>
                <time className="text-xs text-zinc-600">{new Date(article.updatedAt).toLocaleDateString()}</time>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

