import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "../../components/article-content";
import { Card } from "../../components/card";
import { LocalizedDate, LocalizedReadingTime, LocalizedText } from "../../components/language";
import { Navigation } from "../../components/nav";
import { SubscribeForm } from "../../components/subscribe-form";
import {
  getPublicArticleBySlug,
  getPublicArticles,
  getRelatedPublicArticles,
} from "../../lib/articles/repository";
import { estimateReadingTime } from "../../lib/articles/selectors";
import { getSiteUrl } from "../../lib/site-url.mjs";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublicArticles()).map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/analysis/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      url: `/analysis/${article.slug}`,
      publishedTime: article.publishedAt ?? article.createdAt,
      authors: [article.author],
      images: [{ url: article.coverImageUrl ?? "/og.png", width: 1362, height: 482 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.coverImageUrl ?? "/og.png"],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  if (!article) notFound();
  const related = await getRelatedPublicArticles(article);
  const localized = article.localized;
  const publishedAt = article.publishedAt ?? article.createdAt;
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Viking Blackship" },
    mainEntityOfPage: `${siteUrl}/analysis/${article.slug}`,
    image: article.coverImageUrl ?? `${siteUrl}/og.png`,
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Navigation />
      <header className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black px-6 pb-16 pt-32 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
            <span><LocalizedText en={article.category} zh={localized?.category ?? article.category} /></span>
            <span>/</span>
            <time dateTime={publishedAt}><LocalizedDate isoDate={publishedAt} /></time>
            <span>/</span>
            <span><LocalizedReadingTime value={estimateReadingTime(article)} /></span>
          </div>
          <h1 className="mt-6 font-display text-4xl text-white sm:text-6xl">
            <LocalizedText en={article.title} zh={localized?.title ?? article.title} />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            <LocalizedText en={article.subtitle ?? article.summary} zh={localized?.subtitle ?? localized?.summary ?? article.summary} />
          </p>
          {article.coverImageUrl ? <img src={article.coverImageUrl} alt="" className="mx-auto mt-10 max-h-[520px] w-full rounded-xl object-cover" /> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {article.tags.map((tag, index) => (
              <span key={tag} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                <LocalizedText en={tag} zh={localized?.tags[index] ?? tag} />
              </span>
            ))}
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <ArticleContent content={article.content} localizedContent={localized?.content} />
      </article>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><div className="p-6"><h2 className="font-display text-2xl text-zinc-100"><LocalizedText en="Author" zh="作者" /></h2><p className="mt-4 text-sm leading-7 text-zinc-400">{article.author}</p></div></Card>
        <Card><div className="p-6"><h2 className="font-display text-2xl text-zinc-100"><LocalizedText en="Subscribe" zh="订阅" /></h2><p className="mt-4 text-sm leading-7 text-zinc-400"><LocalizedText en="Get future analysis directly in your inbox." zh="把未来分析直接发送到你的邮箱。" /></p><div className="mt-6"><SubscribeForm source={`article-${article.slug}`} compact /></div></div></Card>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="font-display text-2xl text-zinc-100"><LocalizedText en="Related Articles" zh="相关文章" /></h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Card key={item.slug}>
                <Link href={`/analysis/${item.slug}`} className="block p-5">
                  <span className="text-xs text-zinc-500"><LocalizedText en={item.category} zh={item.localized?.category ?? item.category} /></span>
                  <h3 className="mt-3 text-lg font-medium text-zinc-100"><LocalizedText en={item.title} zh={item.localized?.title ?? item.title} /></h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-500"><LocalizedText en={item.summary} zh={item.localized?.summary ?? item.summary} /></p>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
