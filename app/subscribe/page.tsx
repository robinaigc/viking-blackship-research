import { Card } from "../components/card";
import { LocalizedText } from "../components/language";
import { Navigation } from "../components/nav";
import { SubscribeForm } from "../components/subscribe-form";

export const metadata = {
  title: "Subscribe",
  description:
    "Subscribe for sharp, evidence-based analysis on China's economy and policy signals.",
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-28">
        <Card>
          <section className="max-w-3xl p-6 text-center md:p-12">
            <h1 className="font-display text-4xl text-zinc-100 sm:text-5xl">
              <LocalizedText en="Subscribe" zh="订阅" />
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              <LocalizedText
                en="Get sharp, evidence-based analysis on China's economy, policy signals, and local government behavior."
                zh="获取关于中国经济、政策信号和地方政府行为的锋利、证据导向分析。"
              />
            </p>
            <div className="mt-8">
              <SubscribeForm source="subscribe-page" />
            </div>
          </section>
        </Card>
      </div>
    </main>
  );
}
