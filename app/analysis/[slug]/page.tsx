import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "../../components/card";
import {
  LocalizedDate,
  LocalizedReadingTime,
  LocalizedText,
} from "../../components/language";
import { Navigation } from "../../components/nav";
import { SubscribeForm } from "../../components/subscribe-form";
import {
  analysisArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "../../data/analysis";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return analysisArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default function ArticleDetailPage({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article);

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      <header className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black px-6 pb-16 pt-32 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
            <span>
              <LocalizedText en={article.category} zh={article.zh.category} />
            </span>
            <span>/</span>
            <time dateTime={article.publishedAt}>
              <LocalizedDate isoDate={article.publishedAt} />
            </time>
            <span>/</span>
            <span>
              <LocalizedReadingTime value={article.readingTime} />
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl text-white sm:text-6xl">
            <LocalizedText en={article.title} zh={article.zh.title} />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            <LocalizedText en={article.subtitle} zh={article.zh.subtitle} />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
              >
                <LocalizedText en={tag} zh={article.zh.tags[index] ?? tag} />
              </span>
            ))}
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <div className="space-y-7">
          {article.content.map((block, index) => {
            const zhBlock = article.zh.content[index];
            if (block.type === "heading") {
              return (
                <h2
                  key={`${block.type}-${index}`}
                  className="pt-5 font-display text-2xl text-zinc-100"
                >
                  <LocalizedText en={block.text} zh={zhBlock?.type === "heading" ? zhBlock.text : block.text} />
                </h2>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote
                  key={`${block.type}-${index}`}
                  className="border-l border-zinc-600 pl-5 text-lg leading-8 text-zinc-300"
                >
                  <LocalizedText en={block.text} zh={zhBlock?.type === "quote" ? zhBlock.text : block.text} />
                </blockquote>
              );
            }

            if (block.type === "list") {
              return (
                <ul
                  key={`${block.type}-${index}`}
                  className="list-disc space-y-3 pl-5 text-sm leading-7 text-zinc-400"
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={item}>
                      <LocalizedText
                        en={item}
                        zh={
                          zhBlock?.type === "list"
                            ? zhBlock.items[itemIndex] ?? item
                            : item
                        }
                      />
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p
                key={`${block.type}-${index}`}
                className="text-sm leading-8 text-zinc-400 sm:text-base"
              >
                <LocalizedText en={block.text} zh={zhBlock?.type === "paragraph" ? zhBlock.text : block.text} />
              </p>
            );
          })}
        </div>
      </article>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="p-6">
            <h2 className="font-display text-2xl text-zinc-100">
              <LocalizedText en="Author" zh="作者" />
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              <LocalizedText
                en="Robin Seun writes evidence-based analysis on China's economy, policy signals, local government behavior, and macro data."
                zh="Robin Seun 写作关于中国经济、政策信号、地方政府行为和宏观数据的证据导向分析。"
              />
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h2 className="font-display text-2xl text-zinc-100">
              <LocalizedText en="Subscribe" zh="订阅" />
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              <LocalizedText
                en="Get future analysis directly in your inbox."
                zh="把未来分析直接发送到你的邮箱。"
              />
            </p>
            <div className="mt-6">
              <SubscribeForm source={`article-${article.slug}`} compact />
            </div>
          </div>
        </Card>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="font-display text-2xl text-zinc-100">
            <LocalizedText en="Related Articles" zh="相关文章" />
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Card key={item.slug}>
                <Link href={`/analysis/${item.slug}`} className="block p-5">
                  <span className="text-xs text-zinc-500">
                    <LocalizedText en={item.category} zh={item.zh.category} />
                  </span>
                  <h3 className="mt-3 text-lg font-medium text-zinc-100">
                    <LocalizedText en={item.title} zh={item.zh.title} />
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    <LocalizedText en={item.summary} zh={item.zh.summary} />
                  </p>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
