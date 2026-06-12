import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AnalysisCard } from "./components/analysis-card";
import { Card } from "./components/card";
import Particles from "./components/particles";
import { SubscribeForm } from "./components/subscribe-form";
import { LanguageToggle, LocalizedText } from "./components/language";
import { credentials } from "./data/credentials";
import { getFeaturedPublicArticles } from "./lib/articles/repository";
import { products } from "./data/products";

const heroNavItemClassName =
  "text-sm duration-500 text-zinc-500 hover:text-zinc-300";

const navigation = [
  { label: "Analysis", zh: "分析", href: "/analysis" },
  { label: "Products", zh: "产品", href: "/products" },
  { label: "About", zh: "关于", href: "/about" },
  { label: "Subscribe", zh: "订阅", href: "/subscribe" },
];

export default async function Home() {
  const featured = await getFeaturedPublicArticles();

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <nav className="my-12 animate-fade-in">
          <ul className="flex flex-nowrap items-center justify-center gap-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={heroNavItemClassName}>
                  <LocalizedText en={item.label} zh={item.zh} />
                </Link>
              </li>
            ))}
            <li>
              <LanguageToggle className={heroNavItemClassName} />
            </li>
          </ul>
        </nav>
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={180}
        />
        <div className="mb-5 animate-fade-in rounded-full border border-zinc-800 bg-black/30 p-3">
          <Image
            src="/viking-blackship-logo.png"
            alt="Viking Blackship logo"
            width={112}
            height={112}
            className="h-20 w-20 rounded-full object-cover grayscale invert sm:h-28 sm:w-28"
            priority
          />
        </div>
        <p className="-translate-y-[5px] mb-4 animate-fade-in text-sm font-medium tracking-[0.1em] text-zinc-400 sm:text-base">
          Viking Blackship Consulting
        </p>
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-8xl whitespace-nowrap bg-clip-text">
          Robin Seun
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400 animate-fade-in sm:text-base">
          <LocalizedText
            layout="block"
            en="Sharp, evidence-based analysis on China's economy, policy signals, local government behavior, and the hidden mechanics behind official data."
            zh="深入分析中国经济、政策信号、政府行为及官方数据背后的隐性机制。"
          />
        </p>
        <div className="mt-14 hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      </section>

      <section className="mx-auto max-w-7xl space-y-16 px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {credentials.map((item) => (
            <Card key={item.en} className="h-full">
              <p className="h-full px-4 py-3 text-sm leading-6 text-zinc-400">
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en={item.en}
                  zh={item.zh}
                />
              </p>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl text-zinc-100">
                <LocalizedText en="Featured Analysis" zh="精选分析" />
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                <LocalizedText
                  layout="block"
                  en="Essays on policy signals, macro data, local incentives, and industry movement."
                  zh="关于政策信号、宏观数据、地方激励和产业变化的文章。"
                />
              </p>
            </div>
            <Link href="/analysis" className="text-sm text-zinc-300 hover:text-white">
              <LocalizedText en="View all analysis" zh="查看全部分析" /> <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featured.map((article) => (
              <Card key={article.slug} className="h-full">
                <AnalysisCard article={article} />
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="flex h-full flex-col p-6">
                <span className="text-xs text-zinc-500">
                  <LocalizedText en={product.status} zh={product.zh.status} />
                </span>
                <h2 className="mt-4 font-display text-2xl text-zinc-100">
                  <LocalizedText
                    layout="block"
                    en={product.name}
                    zh={product.zh.name}
                  />
                </h2>
                <p className="mt-4 flex-1 text-sm leading-7 text-zinc-400">
                  <LocalizedText
                    layout="block"
                    en={product.summary}
                    zh={product.zh.summary}
                  />
                </p>
                <Link
                  href={`/products#${product.slug}`}
                  className="mt-6 text-sm text-zinc-300 hover:text-white"
                >
                  <LocalizedText en="Explore" zh="查看" /> <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-zinc-800 pt-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-3xl text-zinc-100">
              <LocalizedText en="About" zh="关于" />
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              <LocalizedText
                layout="block"
                en="I write about China's economy, policy signals, local government behavior, and the institutional context behind macro data."
                zh="我写作和研究中国经济、政策信号、地方政府行为，以及宏观数据背后的制度背景。"
              />
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm text-zinc-300 hover:text-white"
            >
              <LocalizedText en="Read more" zh="了解更多" /> <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div>
            <h2 className="font-display text-3xl text-zinc-100">
              <LocalizedText en="Subscribe" zh="订阅" />
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              <LocalizedText
                layout="block"
                en="Get concise, sharp analysis on China's economy and policy signals."
                zh="获取关于中国经济与政策信号的简洁、锋利分析。"
              />
            </p>
            <div className="mt-6">
              <SubscribeForm source="home" compact />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
