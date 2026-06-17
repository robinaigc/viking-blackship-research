import Link from "next/link";
import { LocalizedText } from "../../components/language";
import { requireAdmin } from "../../lib/auth/admin";
import { mapArticleRow, type ArticleRow } from "../../lib/articles/repository";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { deleteArticle } from "../articles/actions";
import { DeleteArticleButton } from "../components/delete-article-button";

type Props = { searchParams: Promise<{ deleted?: string }> };

export const metadata = {
	title: "Article Admin",
	robots: { index: false, follow: false },
};

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
					<p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
						<LocalizedText
							en="Publishing dashboard"
							zh={"\u53d1\u5e03\u7ba1\u7406"}
						/>
					</p>
					<h1 className="mt-3 font-display text-4xl">
						<LocalizedText en="Articles" zh={"\u6587\u7ae0"} />
					</h1>
					<p className="mt-3 text-sm text-zinc-400">
						<LocalizedText
							en="Write privately, save drafts, and publish directly to your website."
							zh={
								"\u79c1\u5bc6\u5199\u4f5c\u3001\u4fdd\u5b58\u8349\u7a3f\u5e76\u76f4\u63a5\u53d1\u5e03\u5230\u4f60\u7684\u7f51\u7ad9\u3002"
							}
						/>
					</p>
				</div>
				<Link
					href="/admin/articles/new"
					className="rounded-lg border border-zinc-500 px-5 py-3 text-sm hover:border-white"
				>
					<LocalizedText en="New article" zh={"\u65b0\u5efa\u6587\u7ae0"} />
				</Link>
			</div>

			{params.deleted ? (
				<p className="mt-8 rounded-lg border border-zinc-800 p-4 text-sm text-zinc-300">
					<LocalizedText
						en="Article deleted."
						zh={"\u6587\u7ae0\u5df2\u5220\u9664\u3002"}
					/>
				</p>
			) : null}
			{error ? (
				<p className="mt-8 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
					{error.message}
				</p>
			) : null}

			<div className="mt-10 overflow-hidden rounded-xl border border-zinc-800">
				{articles.length === 0 ? (
					<div className="p-10 text-center text-sm text-zinc-500">
						<LocalizedText
							en="No articles yet. Create your first article."
							zh={
								"\u8fd8\u6ca1\u6709\u6587\u7ae0\uff0c\u8bf7\u521b\u5efa\u7b2c\u4e00\u7bc7\u6587\u7ae0\u3002"
							}
						/>
					</div>
				) : (
					<div className="divide-y divide-zinc-800">
						{articles.map((article) => (
							<div
								key={article.id}
								className="grid gap-3 p-5 hover:bg-zinc-900/70 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
							>
								<div>
									<Link
										href={`/admin/articles/${article.id}`}
										className="font-medium text-zinc-100 hover:text-white"
									>
										{article.title}
									</Link>
									<p className="mt-1 text-xs text-zinc-600">
										/analysis/{article.slug}
									</p>
								</div>
								<span
									className={`w-fit rounded-full px-3 py-1 text-xs ${
										article.status === "published"
											? "bg-emerald-950 text-emerald-300"
											: "bg-zinc-800 text-zinc-400"
									}`}
								>
									{article.status === "published" ? (
										<LocalizedText en="published" zh={"\u5df2\u53d1\u5e03"} />
									) : (
										<LocalizedText en="draft" zh={"\u8349\u7a3f"} />
									)}
								</span>
								<div className="flex items-center gap-4">
									<time className="text-xs text-zinc-600">
										{new Date(article.updatedAt).toLocaleDateString()}
									</time>
									<form action={deleteArticle}>
										<input type="hidden" name="id" value={article.id} />
										<input type="hidden" name="slug" value={article.slug} />
										<DeleteArticleButton title={article.title} />
									</form>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
