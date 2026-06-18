import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth/admin";
import {
	mapArticleRow,
	type ArticleRow,
} from "../../../../lib/articles/repository";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { ArticleForm } from "../../../components/article-form";
import { getAdminCategoryOptions } from "../../../articles/categories";
import { deleteArticle, updateArticle } from "../../../articles/actions";

type Props = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function EditArticlePage({ params, searchParams }: Props) {
	const admin = await requireAdmin();
	const { id } = await params;
	const query = await searchParams;
	const supabase = await createSupabaseServerClient();
	if (!supabase) notFound();
	const { data, error } = await supabase
		.from("articles")
		.select("*")
		.eq("id", id)
		.eq("owner_id", admin.id)
		.single();
	if (error || !data) notFound();
	const article = mapArticleRow(data as ArticleRow);
	const categoryOptions = await getAdminCategoryOptions();

	return (
		<main className="mx-auto max-w-6xl px-6 py-12">
			<div className="flex flex-wrap items-center gap-4">
				<Link href="/admin" className="text-sm text-zinc-500 hover:text-white">
					&larr; All articles
				</Link>
				{article.status === "published" ? (
					<Link
						href={`/analysis/${article.slug}`}
						className="text-sm text-zinc-500 hover:text-white"
					>
						View published article
					</Link>
				) : null}
			</div>
			<h1 className="mt-6 font-display text-4xl">Edit article</h1>
			<div className="mt-10">
				<ArticleForm
					article={article}
					action={updateArticle}
					categoryOptions={categoryOptions}
					saved={query.saved === "1"}
					error={query.error}
				/>
			</div>
			<form
				action={deleteArticle}
				className="mt-12 border-t border-red-950 pt-8"
			>
				<input type="hidden" name="id" value={article.id} />
				<input type="hidden" name="slug" value={article.slug} />
				<button
					type="submit"
					className="rounded-lg border border-red-900 px-5 py-3 text-sm text-red-400 hover:border-red-500"
				>
					Delete article permanently
				</button>
			</form>
		</main>
	);
}
