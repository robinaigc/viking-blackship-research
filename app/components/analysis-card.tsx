import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ArticleRecord } from "../lib/articles/types";
import { estimateReadingTime } from "../lib/articles/selectors";
import { LocalizedDate, LocalizedReadingTime, LocalizedText } from "./language";

type Props = { article: ArticleRecord; large?: boolean };

export function AnalysisCard({ article, large = false }: Props) {
  const localized = article.localized;
  const publishedAt = article.publishedAt ?? article.createdAt;
  return (
    <Link href={`/analysis/${article.slug}`} className="block h-full">
      <article className={`flex h-full flex-col ${large ? "p-6 md:p-8" : "p-4 md:p-6"}`}>
        {article.coverImageUrl ? (
          <img src={article.coverImageUrl} alt="" className="mb-5 aspect-[16/9] w-full rounded-lg object-cover" loading="lazy" />
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-zinc-300"><LocalizedText en={article.category} zh={localized?.category ?? article.category} /></span>
          <span className="text-xs text-zinc-500"><LocalizedReadingTime value={estimateReadingTime(article)} /></span>
        </div>
        <h2 className={`mt-4 font-display font-medium text-zinc-100 duration-500 group-hover:text-white ${large ? "text-3xl sm:text-4xl" : "text-xl lg:text-2xl"}`}>
          <LocalizedText layout="block" en={article.title} zh={localized?.title ?? article.title} />
        </h2>
        <p className="mt-4 flex-1 text-sm leading-7 text-zinc-400 duration-500 group-hover:text-zinc-200">
          <LocalizedText layout="block" en={article.summary} zh={localized?.summary ?? article.summary} />
        </p>
        <div className="mt-6 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <time className="text-xs text-zinc-500" dateTime={publishedAt}><LocalizedDate isoDate={publishedAt} /></time>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-300"><LocalizedText en="Read" zh="阅读" /> <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </div>
          <div className="mt-5 flex min-h-[1.75rem] flex-wrap content-start gap-2">
            {article.tags.map((tag, index) => (
              <span key={tag} className="rounded-full border border-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
                <LocalizedText en={tag} zh={localized?.tags[index] ?? tag} />
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
