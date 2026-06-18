import Link from "next/link";
import { ArticleForm } from "../../../components/article-form";
import { getAdminCategoryOptions } from "../../../articles/categories";
import { createArticle } from "../../../articles/actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewArticlePage({ searchParams }: Props) {
	const params = await searchParams;
	const categoryOptions = await getAdminCategoryOptions();
	return (
		<main className="mx-auto max-w-6xl px-6 py-12">
			<Link href="/admin" className="text-sm text-zinc-500 hover:text-white">
				&larr; All articles
			</Link>
			<h1 className="mt-6 font-display text-4xl">New article</h1>
			<div className="mt-10">
				<ArticleForm
					action={createArticle}
					categoryOptions={categoryOptions}
					error={params.error}
				/>
			</div>
		</main>
	);
}
