import { AnalysisCard } from "../components/analysis-card";
import { Card } from "../components/card";
import { LocalizedText } from "../components/language";
import { Navigation } from "../components/nav";
import { categories, getPublishedArticles } from "../data/analysis";

export const metadata = {
  title: "Analysis",
  description:
    "English commentary on China's economy, policy signals, local government behavior, and supply chains.",
};

export default function AnalysisPage() {
  const articles = getPublishedArticles();

  return (
    <main className="min-h-screen bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="mx-auto max-w-7xl space-y-12 px-6 pb-20 pt-28 lg:px-8 lg:pt-36">
        <section className="max-w-3xl">
          <h1 className="font-display text-4xl text-zinc-100 sm:text-5xl">
            <LocalizedText en="Analysis" zh="分析" />
          </h1>
          <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
            <LocalizedText
              en="English commentary on China's economy, policy signals, local government behavior, and the institutional context behind macro data."
              zh="关于中国经济、政策信号、地方政府行为，以及宏观数据背后制度背景的英文评论分析。"
            />
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400"
            >
              <LocalizedText
                en={category}
                zh={
                  category === "China Economy"
                    ? "中国经济"
                    : category === "Policy Signals"
                      ? "政策信号"
                      : category === "Local Government"
                        ? "地方政府"
                        : "产业与供应链"
                }
              />
            </span>
          ))}
        </div>

        <div className="h-px w-full bg-zinc-800" />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {articles.map((article, index) => (
            <Card key={article.slug} className="h-full">
              <AnalysisCard article={article} large={index === 0} />
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
