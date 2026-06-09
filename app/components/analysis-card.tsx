import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AnalysisArticle } from "../data/analysis";
import { LocalizedDate, LocalizedReadingTime, LocalizedText } from "./language";

type Props = {
  article: AnalysisArticle;
  large?: boolean;
};

export function AnalysisCard({ article, large = false }: Props) {
  return (
    <Link href={`/analysis/${article.slug}`} className="block h-full">
      <article
        className={`flex h-full flex-col ${large ? "p-6 md:p-8" : "p-4 md:p-6"}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-zinc-300">
            <LocalizedText en={article.category} zh={article.zh.category} />
          </span>
          <span className="text-xs text-zinc-500">
            <LocalizedReadingTime value={article.readingTime} />
          </span>
        </div>
        <h2
          className={`mt-4 font-display font-medium text-zinc-100 duration-500 group-hover:text-white ${
            large ? "text-3xl sm:text-4xl" : "text-xl lg:text-2xl"
          }`}
        >
          <LocalizedText
            layout="block"
            en={article.title}
            zh={article.zh.title}
          />
        </h2>
        <p className="mt-4 flex-1 text-sm leading-7 text-zinc-400 duration-500 group-hover:text-zinc-200">
          <LocalizedText
            layout="block"
            en={article.summary}
            zh={article.zh.summary}
          />
        </p>
        <div className="mt-6 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <time className="text-xs text-zinc-500" dateTime={article.publishedAt}>
              <LocalizedDate isoDate={article.publishedAt} />
            </time>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-300">
              <LocalizedText en="Read" zh="阅读" />{" "}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-5 flex min-h-[1.75rem] flex-wrap content-start gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-800 px-2.5 py-1 text-xs text-zinc-500"
              >
                <LocalizedText en={tag} zh={article.zh.tags[index] ?? tag} />
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
