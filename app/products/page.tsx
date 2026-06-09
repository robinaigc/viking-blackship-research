import Link from "next/link";
import { Card } from "../components/card";
import { LocalizedText } from "../components/language";
import { Navigation } from "../components/nav";
import { SubscribeForm } from "../components/subscribe-form";
import { products } from "../data/products";

export const metadata = {
  title: "Products",
  description:
    "Future briefings, newsletters, and analysis toolkits from Robin Seun.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="mx-auto max-w-7xl space-y-12 px-6 pb-20 pt-28 lg:px-8 lg:pt-36">
        <section className="max-w-3xl">
          <h1 className="font-display text-4xl text-zinc-100 sm:text-5xl">
            <LocalizedText en="Products" zh="产品" />
          </h1>
          <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
            <LocalizedText
              en="Future briefings, newsletters, toolkits, and research products built around evidence, policy signals, and practical analytical method."
              zh="围绕证据、政策信号和实用分析方法构建的未来简报、通讯、工具包与研究产品。"
            />
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <section
                id={product.slug}
                className="grid scroll-mt-28 grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr]"
              >
                <div>
                  <span className="text-xs text-zinc-500">
                    <LocalizedText en={product.status} zh={product.zh.status} />
                  </span>
                  <h2 className="mt-4 font-display text-3xl text-zinc-100">
                    <LocalizedText en={product.name} zh={product.zh.name} />
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    <LocalizedText en={product.summary} zh={product.zh.summary} />
                  </p>
                </div>
                <div className="space-y-5 text-sm leading-7 text-zinc-400">
                  <p>
                    <LocalizedText en={product.description} zh={product.zh.description} />
                  </p>
                  <p>
                    <span className="text-zinc-300">
                      <LocalizedText en="Type:" zh="类型：" />
                    </span>{" "}
                    <LocalizedText en={product.type} zh={product.zh.type} />
                  </p>
                  <p>
                    <span className="text-zinc-300">
                      <LocalizedText en="Suitable for:" zh="适合对象：" />
                    </span>{" "}
                    <LocalizedText en={product.targetAudience} zh={product.zh.targetAudience} />
                  </p>
                  <Link
                    href={product.callToActionLink}
                    className="inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200 duration-200 hover:border-zinc-300 hover:text-white"
                  >
                    <LocalizedText en={product.callToActionText} zh={product.zh.callToActionText} />
                  </Link>
                </div>
              </section>
            </Card>
          ))}
        </div>

        <section className="border-t border-zinc-800 pt-12">
          <h2 className="font-display text-3xl text-zinc-100">
            <LocalizedText en="Stay in the loop" zh="保持更新" />
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            <LocalizedText
              en="Leave your email for future briefings, newsletter updates, and method toolkit releases."
              zh="留下邮箱，接收未来简报、Newsletter 更新和方法工具包发布信息。"
            />
          </p>
          <div className="mt-6">
            <SubscribeForm source="products" compact />
          </div>
        </section>
      </div>
    </main>
  );
}
