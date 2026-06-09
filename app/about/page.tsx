import Link from "next/link";
import { Card } from "../components/card";
import { LocalizedText } from "../components/language";
import { Navigation } from "../components/nav";
const whoIAmBio = {
  en: "Hello, I'm Robin Seun, founder of Viking Blackship Consulting. I am a researcher in China's macroeconomy and policy, and have been invited on multiple occasions to participate in State Council economic situation seminars on policy formulation, economic performance, SME challenges, and industrial issues. I also serve concurrently as an expert member of the NDRC Department of Trade and Economic Affairs, MOFCOM Department of Market System Development, and the Ministry of Agriculture and Rural Affairs research institute. For many years, I have focused on macroeconomic and policy research. I have led teams to complete 200+ planning and consulting projects and submitted research reports to NDRC and MOFCOM on multiple occasions.",
  zh: "大家好，我是Robin Seun，是维京黑船（Viking Blackship Consulting）的创始人。我是一名中国宏观经济及政策研究人员，曾多次受邀参加中华人民共和国国务院经济形势研讨，研讨政策制定、经济运行、中小企业困境及产业问题。同时兼任国家发改委经贸司、商务部市场建设司、农业农村部研究院专家成员。多年来致力于研究宏观经济与政策。带队完成200+规划与咨询项目，且多次为国家发改委、商务部提交研究报告。",
};

const writingTopics = [
  { en: "China macroeconomy", zh: "中国宏观经济" },
  { en: "Policy analysis", zh: "政策分析" },
  { en: "Government behavior", zh: "政府行为" },
  { en: "Data research", zh: "数据研究" },
  { en: "Industry planning", zh: "产业规划" },
  { en: "Logistics and supply chain", zh: "物流与供应链" },
  { en: "Planning and consulting", zh: "规划咨询" },
];

const methodFocusQuestions = [
  { en: "Are policy goals credible?", zh: "政策目标是否真实" },
  { en: "Are implementation mechanisms feasible?", zh: "执行机制是否可行" },
  {
    en: "Who ultimately bears the cost?",
    zh: "成本最终由谁承担",
  },
  {
    en: "Do official narratives align with real-world data?",
    zh: "官方叙事和现实数据是否一致",
  },
];

export const metadata = {
  title: "About",
  description:
    "About Robin Seun, his research background, writing focus, and analytical method.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="mx-auto max-w-6xl space-y-12 px-6 pb-20 pt-28 lg:px-8 lg:pt-36">
        <section className="max-w-3xl">
          <h1 className="font-display text-4xl text-zinc-100 sm:text-5xl">
            <LocalizedText en="About" zh="关于" />
          </h1>
          <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
            <LocalizedText
              layout="block"
              en="I write about China's economy, policy signals, local government behavior, and the institutional context behind macro data."
              zh="我写作和研究中国经济、政策信号、地方政府行为，以及宏观数据背后的制度背景。"
            />
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="h-full">
            <section className="h-full p-6 md:p-8">
              <h2 className="font-display text-2xl text-zinc-100">
                <LocalizedText en="Who I Am" zh="我是谁" />
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en={whoIAmBio.en}
                  zh={whoIAmBio.zh}
                />
              </p>
            </section>
          </Card>
          <Card className="h-full">
            <section className="h-full p-6 md:p-8">
              <h2 className="font-display text-2xl text-zinc-100">
                <LocalizedText en="What I Write About" zh="我写什么" />
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {writingTopics.map((topic) => (
                  <span
                    key={topic.en}
                    className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400"
                  >
                    <LocalizedText en={topic.en} zh={topic.zh} />
                  </span>
                ))}
              </div>
            </section>
          </Card>
        </div>

        <Card>
          <section className="p-6 md:p-8">
            <h2 className="font-display text-2xl text-zinc-100">
              <LocalizedText en="My Research Method" zh="我的研究方法" />
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-zinc-400">
              <p>
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en="I usually analyze issues across three layers: policy texts, data evidence, and behavioral incentives."
                  zh="我通常从政策文本、数据证据和行为激励三个层面分析问题。"
                />
              </p>
              <p>
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en="First, I look at what a policy is truly trying to solve, whether its goals are credible, and whether its constraints are clear."
                  zh="首先看政策真正想解决什么，目标是否真实，约束条件是否清楚。"
                />
              </p>
              <p>
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en="Second, I examine whether fiscal conditions, debt burdens, industries, firms, and local governments have the capacity to implement it."
                  zh="其次看财政、债务、产业、企业和地方政府是否具备执行条件。"
                />
              </p>
              <p>
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en="Finally, I look at how different actors are likely to respond, and how policy is likely to be reshaped in practice."
                  zh="最后看不同主体会如何反应，政策在现实中会如何变形。"
                />
              </p>
              <p>
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en="I pay particular attention to four questions:"
                  zh="我尤其关注四个问题："
                />
              </p>
              <ul className="space-y-2">
                {methodFocusQuestions.map((item) => (
                  <li key={item.en}>
                    <LocalizedText en={item.en} zh={item.zh} />
                  </li>
                ))}
              </ul>
              <p>
                <LocalizedText
                  layout="block"
                  reserveSpace={false}
                  en="My writing is less about restating the news than explaining the structural logic behind China's economy, policy signals, and government behavior."
                  zh="我写作的重点不是复述新闻，而是解释中国经济、政策信号和政府行为背后的结构性逻辑。"
                />
              </p>
            </div>
          </section>
        </Card>

        <section className="flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-12">
          <Link
            href="/analysis"
            className="rounded-lg border border-zinc-500 px-5 py-3 text-sm text-zinc-200 duration-200 hover:border-zinc-200 hover:text-white"
          >
            <LocalizedText en="Read Analysis" zh="分析文章" />
          </Link>
          <Link
            href="/subscribe"
            className="rounded-lg border border-zinc-800 px-5 py-3 text-sm text-zinc-400 duration-200 hover:border-zinc-500 hover:text-zinc-100"
          >
            <LocalizedText en="Subscribe" zh="订阅" />
          </Link>
        </section>
      </div>
    </main>
  );
}
