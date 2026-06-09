export type ArticleContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type AnalysisArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  category:
    | "China Economy"
    | "Policy Signals"
    | "Local Government"
    | "Industry & Supply Chain";
  tags: string[];
  publishedAt: string;
  readingTime: string;
  author: string;
  content: ArticleContentBlock[];
  zh: {
    title: string;
    subtitle: string;
    summary: string;
    category: string;
    tags: string[];
    content: ArticleContentBlock[];
  };
  featured: boolean;
  status: "published" | "draft";
};

export const analysisArticles: AnalysisArticle[] = [
  {
    id: "policy-signals-local-incentives",
    slug: "policy-signals-local-incentives",
    title: "Policy Signals Are Clearer When Local Incentives Are Visible",
    subtitle:
      "A useful reading of Chinese policy starts with the gap between stated goals and implementation incentives.",
    summary:
      "Beijing's targets matter, but the practical signal often appears in how local governments translate them into projects, financing choices, and enforcement rhythms.",
    category: "Policy Signals",
    tags: ["policy", "local incentives", "implementation"],
    publishedAt: "2026-05-28",
    readingTime: "6 min read",
    author: "Robin Seun",
    featured: true,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Policy documents often look abstract on first read. The sharper question is not whether a goal is important, but which agencies, firms, and local governments gain room to act after the signal is released.",
      },
      {
        type: "heading",
        text: "Read the implementation channel",
      },
      {
        type: "paragraph",
        text: "Local governments rarely implement policy in a neutral environment. They face fiscal pressure, employment targets, industrial competition, land constraints, and political evaluation. These incentives shape which policies become concrete and which stay rhetorical.",
      },
      {
        type: "quote",
        text: "A policy signal becomes economically meaningful when it changes the behavior of local actors with budgets, mandates, and constraints.",
      },
      {
        type: "list",
        items: [
          "Look for funding mechanisms, not only slogans.",
          "Compare central priorities with local fiscal capacity.",
          "Track which sectors receive administrative acceleration.",
        ],
      },
    ],
    zh: {
      title: "看清地方激励，政策信号才会更清楚",
      subtitle: "理解中国政策，关键在于看见官方目标与执行激励之间的距离。",
      summary:
        "中央目标很重要，但真正有解释力的信号，往往出现在地方政府如何把目标转化为项目、融资选择与执行节奏之中。",
      category: "政策信号",
      tags: ["政策", "地方激励", "执行"],
      content: [
        {
          type: "paragraph",
          text: "政策文件初读时常常显得抽象。更锋利的问题不是某个目标是否重要，而是这个信号释放后，哪些部门、企业和地方政府获得了行动空间。",
        },
        { type: "heading", text: "阅读执行通道" },
        {
          type: "paragraph",
          text: "地方政府从来不是在中性环境中执行政策。财政压力、就业目标、产业竞争、土地约束和考核机制，都会影响哪些政策会落地，哪些只是停留在表达层面。",
        },
        {
          type: "quote",
          text: "当一个政策信号改变了拥有预算、任务和约束的地方行动者行为时，它才真正具有经济意义。",
        },
        {
          type: "list",
          items: [
            "看资金机制，而不只看口号。",
            "比较中央优先级与地方财政能力。",
            "追踪哪些行业获得了行政加速。",
          ],
        },
      ],
    },
  },
  {
    id: "macro-data-needs-institutional-context",
    slug: "macro-data-needs-institutional-context",
    title: "Macro Data Needs Institutional Context",
    subtitle:
      "Economic indicators are more useful when read against incentives, reporting cycles, and policy constraints.",
    summary:
      "Headline numbers can hide the practical rhythm of policy response. Context turns data from a dashboard into an interpretation.",
    category: "China Economy",
    tags: ["macro data", "economy", "interpretation"],
    publishedAt: "2026-05-12",
    readingTime: "5 min read",
    author: "Robin Seun",
    featured: true,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Macro data is not self-explanatory. The same number can imply different policy reactions depending on whether officials see it as cyclical weakness, structural pressure, or a manageable transition cost.",
      },
      {
        type: "heading",
        text: "What to compare",
      },
      {
        type: "list",
        items: [
          "The current indicator against its policy target.",
          "The same indicator against local fiscal and credit conditions.",
          "Official language before and after the data release.",
        ],
      },
      {
        type: "paragraph",
        text: "This is why careful analysis must combine data, documents, and observed implementation. The signal lives in the relationship between them.",
      },
    ],
    zh: {
      title: "宏观数据需要制度背景",
      subtitle: "经济指标只有放进激励、统计节奏和政策约束中，才更有解释力。",
      summary:
        "标题数字可能掩盖政策反应的真实节奏。背景信息能把数据从仪表盘变成判断依据。",
      category: "中国经济",
      tags: ["宏观数据", "经济", "解读"],
      content: [
        {
          type: "paragraph",
          text: "宏观数据并不会自动说明问题。同一个数字，在不同政策语境下，可能意味着周期性疲弱、结构性压力，或可接受的转型成本。",
        },
        { type: "heading", text: "应该比较什么" },
        {
          type: "list",
          items: [
            "当前指标与政策目标之间的距离。",
            "同一指标与地方财政、信用条件之间的关系。",
            "数据发布前后官方语言的变化。",
          ],
        },
        {
          type: "paragraph",
          text: "因此，谨慎的分析必须同时结合数据、文件和实际执行。信号存在于它们之间的关系里。",
        },
      ],
    },
  },
  {
    id: "supply-chain-policy-is-local",
    slug: "supply-chain-policy-is-local",
    title: "Supply Chain Policy Is Often Local Before It Is National",
    subtitle:
      "Industrial policy becomes visible in parks, logistics corridors, procurement rules, and local investment choices.",
    summary:
      "The national narrative sets direction, but supply chain behavior often changes first through local coordination and infrastructure decisions.",
    category: "Industry & Supply Chain",
    tags: ["supply chain", "industry", "logistics"],
    publishedAt: "2026-04-30",
    readingTime: "7 min read",
    author: "Robin Seun",
    featured: true,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Supply chain policy is easy to describe in broad national terms, but difficult to understand without local detail. The relevant evidence often appears in land use, logistics links, industrial parks, and procurement priorities.",
      },
      {
        type: "heading",
        text: "Where the signal appears",
      },
      {
        type: "list",
        items: [
          "Local plans that name priority clusters.",
          "Cold chain, warehousing, and port-adjacent logistics investment.",
          "Changes in project approvals and industrial park positioning.",
        ],
      },
      {
        type: "paragraph",
        text: "The practical question is which local systems are reorganizing around a policy goal, not only whether the central document mentions a sector.",
      },
    ],
    zh: {
      title: "供应链政策往往先在地方层面显形",
      subtitle: "产业政策会在园区、物流通道、采购规则和地方投资选择中变得可见。",
      summary:
        "国家叙事设定方向，但供应链行为的改变，常常先通过地方协调和基础设施决策出现。",
      category: "产业与供应链",
      tags: ["供应链", "产业", "物流"],
      content: [
        {
          type: "paragraph",
          text: "供应链政策很容易被描述成宏观叙事，但如果没有地方细节，就很难真正理解。关键证据常常出现在土地使用、物流连接、产业园区和采购优先级中。",
        },
        { type: "heading", text: "信号出现在哪里" },
        {
          type: "list",
          items: [
            "点名优先产业集群的地方规划。",
            "冷链、仓储和港口周边物流投资。",
            "项目审批与产业园定位的变化。",
          ],
        },
        {
          type: "paragraph",
          text: "真正的问题不是中央文件是否提到某个行业，而是哪些地方系统正在围绕这个政策目标重新组织。",
        },
      ],
    },
  },
  {
    id: "local-government-behavior-fiscal-pressure",
    slug: "local-government-behavior-fiscal-pressure",
    title: "Fiscal Pressure Changes Local Government Behavior",
    subtitle:
      "When budget constraints tighten, local implementation choices become a clearer economic signal.",
    summary:
      "Local governments under pressure reveal priorities through project selection, spending discipline, and how they balance growth with risk control.",
    category: "Local Government",
    tags: ["local government", "fiscal pressure", "projects"],
    publishedAt: "2026-04-16",
    readingTime: "6 min read",
    author: "Robin Seun",
    featured: false,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Fiscal pressure does not simply reduce activity. It changes what kind of activity survives. Projects with stronger political relevance, clearer funding channels, or higher employment impact tend to receive more attention.",
      },
      {
        type: "quote",
        text: "Scarcity is an analytical filter: it shows which priorities local governments treat as non-negotiable.",
      },
      {
        type: "paragraph",
        text: "That makes local behavior a useful reading layer for national economic policy. It shows where ambition meets constraint.",
      },
    ],
    zh: {
      title: "财政压力会改变地方政府行为",
      subtitle: "当预算约束收紧时，地方执行选择本身就会变成更清楚的经济信号。",
      summary:
        "承压的地方政府会通过项目选择、支出纪律，以及增长与风险控制之间的平衡，暴露真实优先级。",
      category: "地方政府",
      tags: ["地方政府", "财政压力", "项目"],
      content: [
        {
          type: "paragraph",
          text: "财政压力并不只是减少活动，它会改变什么样的活动能够存活。政治相关性更强、资金通道更清楚、就业影响更大的项目，往往会获得更多注意力。",
        },
        {
          type: "quote",
          text: "稀缺是一种分析过滤器：它会显示地方政府把哪些优先级视为不可退让。",
        },
        {
          type: "paragraph",
          text: "这也让地方行为成为理解国家经济政策的一层重要读法。它展示了雄心如何遇到约束。",
        },
      ],
    },
  },
];

export const categories = [
  "China Economy",
  "Policy Signals",
  "Local Government",
  "Industry & Supply Chain",
] as const;

export function getPublishedArticles() {
  return analysisArticles
    .filter((article) => article.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime(),
    );
}

export function getFeaturedArticles() {
  return getPublishedArticles().filter((article) => article.featured).slice(0, 3);
}

export function getArticleBySlug(slug: string) {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(article: AnalysisArticle) {
  return getPublishedArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .filter(
      (candidate) =>
        candidate.category === article.category ||
        candidate.tags.some((tag) => article.tags.includes(tag)),
    )
    .slice(0, 3);
}
