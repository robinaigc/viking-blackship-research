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
    id: "central-local-policy-gap",
    slug: "central-local-policy-gap",
    title: "Policy Signals Deform Between Beijing and the Local Level",
    subtitle:
      "Central documents set direction, but the economically meaningful signal often appears only after local governments reinterpret them.",
    summary:
      "Repeated participation in State Council economic seminars makes one point clear: policy is rarely wrong at the level of intent. It is often incomplete at the level of implementation.",
    category: "Policy Signals",
    tags: ["policy signals", "local government", "implementation"],
    publishedAt: "2026-05-28",
    readingTime: "8 min read",
    author: "Robin Seun",
    featured: true,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Many readers treat a new policy document as the end of the analysis. In practice, it is closer to the beginning. The document states what the system wants. The harder question is which local actors can act on it, under what fiscal and political constraints, and with what measurable incentive.",
      },
      {
        type: "heading",
        text: "Read the document, then read the executor",
      },
      {
        type: "paragraph",
        text: "A policy signal becomes useful only when it changes behavior among actors with budgets, mandates, and evaluation pressure. That is why the gap between central language and local action is not a secondary detail. It is often the main channel through which China's economic policy becomes real.",
      },
      {
        type: "quote",
        text: "The signal is not what Beijing says. The signal is what local governments can afford to do after Beijing speaks.",
      },
      {
        type: "list",
        items: [
          "Identify which agencies receive funding language, not only rhetorical support.",
          "Compare the policy target with local fiscal capacity and debt conditions.",
          "Track whether project approvals, land supply, or procurement rules move before public commentary does.",
        ],
      },
      {
        type: "paragraph",
        text: "This is the layer where policy analysis stops being commentary and starts becoming research. The goal is not to repeat the headline. It is to explain why the same central instruction produces different outcomes in different provinces.",
      },
    ],
    zh: {
      title: "政策信号如何在中央与地方之间变形",
      subtitle:
        "中央文件负责定方向，但真正有经济意义的信号，往往出现在地方重新理解政策之后。",
      summary:
        "多次参加国务院经济形势研讨后，一个很深的体会是：政策的问题通常不在目标本身，而在执行链条是否成立。",
      category: "政策信号",
      tags: ["政策信号", "地方政府", "政策执行"],
      content: [
        {
          type: "paragraph",
          text: "很多读者会把一份新政策文件当作分析的终点，但它更接近起点。文件说明的是系统想要什么，更难的问题是：哪些地方主体有能力行动，它们面对怎样的财政与考核约束，以及它们有什么可测量的激励。",
        },
        { type: "heading", text: "先读文件，再读执行者" },
        {
          type: "paragraph",
          text: "政策信号只有改变了拥有预算、任务和考核压力的主体行为，才真正有用。这也是为什么中央表述与地方行动之间的裂缝，并不是次要细节，而常常是中国经济政策变成现实的主通道。",
        },
        {
          type: "quote",
          text: "信号不是北京说了什么，而是地方在听完北京的话之后，能够负担得起什么。",
        },
        {
          type: "list",
          items: [
            "识别哪些部门获得了资金安排，而不只是口号式支持。",
            "把政策目标与地方财政能力、债务状况放在一起比较。",
            "追踪项目审批、土地供应和采购规则是否先于公开解读发生变化。",
          ],
        },
        {
          type: "paragraph",
          text: "分析到这里，政策研究才从评论变成研究。目标不是复述标题，而是解释为什么同一条中央指令会在不同省份产生不同结果。",
        },
      ],
    },
  },
  {
    id: "sme-pressure-policy-implementation",
    slug: "sme-pressure-policy-implementation",
    title: "SME Pressure Reveals the Gap Between Policy Goals and Delivery",
    subtitle:
      "Small and medium enterprises are often discussed as a policy priority, but their condition is one of the clearest tests of whether support mechanisms actually work.",
    summary:
      "In State Council economic discussions, SME difficulties are never only a business story. They are a policy implementation story about credit, local incentives, and fiscal trade-offs.",
    category: "China Economy",
    tags: ["SME", "credit", "policy implementation"],
    publishedAt: "2026-05-12",
    readingTime: "7 min read",
    author: "Robin Seun",
    featured: true,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "SME difficulties are usually reported as financing problems, weak orders, or rising costs. Those are real pressures, but they are also symptoms. The deeper question is whether the policy system has created a support channel that local governments and banks can actually use without violating other priorities.",
      },
      {
        type: "heading",
        text: "Support policy must survive local trade-offs",
      },
      {
        type: "paragraph",
        text: "A policy to help SMEs only works if it fits inside local fiscal discipline, employment targets, risk control, and industrial upgrading goals. When those goals conflict, local actors do not ignore the policy. They reinterpret it.",
      },
      {
        type: "list",
        items: [
          "Watch whether credit support is broad in language but narrow in eligible borrowers.",
          "Compare SME relief rhetoric with local tax, land, and procurement behavior.",
          "Ask who bears the cost if support is expanded: banks, local fiscal accounts, or future risk controls.",
        ],
      },
      {
        type: "paragraph",
        text: "That is why SME analysis belongs in macro and policy research, not only in sector commentary. It shows whether the system's stated priorities can survive contact with institutional reality.",
      },
    ],
    zh: {
      title: "中小企业困境，暴露的是政策目标与落地之间的距离",
      subtitle:
        "中小企业常被写进政策优先事项，但它们的真实状况，恰恰是检验支持机制是否有效的窗口。",
      summary:
        "在国务院经济形势研讨中，中小企业困境从来不只是企业故事，更是关于信贷、地方激励和财政取舍的政策执行故事。",
      category: "中国经济",
      tags: ["中小企业", "信贷", "政策执行"],
      content: [
        {
          type: "paragraph",
          text: "中小企业困难通常被描述为融资难问题、订单走弱或成本上升。这些压力都真实存在，但它们也是症状。更深的问题是：政策体系是否建立了地方政府和银行在不冲击其他任务的前提下，真正能够使用的支持通道。",
        },
        { type: "heading", text: "支持政策必须穿过地方取舍" },
        {
          type: "paragraph",
          text: "帮助中小企业的政策，只有在不破坏地方财政纪律、就业考核、风险控制和产业升级目标时才会有效。当这些目标彼此冲突时，地方主体不会简单无视政策，而是会重新理解政策。",
        },
        {
          type: "list",
          items: [
            "观察信贷支持在表述上是否宽泛，但在合格主体上是否狭窄。",
            "把帮扶中小企业的政策语言，与地方税收、土地和采购行为对照着看。",
            "追问如果支持扩大，成本最终由谁承担：银行、地方财政，还是未来的风控收紧。",
          ],
        },
        {
          type: "paragraph",
          text: "因此，中小企业分析应属于宏观与政策研究，而不只是行业评论。它揭示的是：系统宣称的优先级，能否在制度现实中存活下来。",
        },
      ],
    },
  },
  {
    id: "industrial-planning-execution-feasibility",
    slug: "industrial-planning-execution-feasibility",
    title: "Industrial Planning Fails When Execution Conditions Are Ignored",
    subtitle:
      "A plan is not credible because it names the right sector. It is credible only when logistics, finance, and local coordination can support it.",
    summary:
      "After more than 200 planning and consulting projects, the same pattern appears repeatedly: the weakest point is rarely the vision. It is the execution chain.",
    category: "Industry & Supply Chain",
    tags: ["industrial planning", "logistics", "supply chain"],
    publishedAt: "2026-04-30",
    readingTime: "8 min read",
    author: "Robin Seun",
    featured: true,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Industrial planning documents often read convincingly on paper. They identify strategic sectors, name national priorities, and describe future clusters with confidence. The problem is that policy and planning are not validated by wording. They are validated by whether goods, capital, land, and administrative attention can move through the system.",
      },
      {
        type: "heading",
        text: "Three execution tests matter most",
      },
      {
        type: "list",
        items: [
          "Logistics feasibility: can inputs, storage, and distribution actually support the proposed chain?",
          "Fiscal feasibility: who funds the first phase, and what happens when returns are slower than projected?",
          "Institutional feasibility: which local agencies have both the mandate and the incentive to keep pushing after the launch period?",
        ],
      },
      {
        type: "quote",
        text: "A sector becomes real when parks, ports, warehouses, procurement, and credit begin to reorganize around it—not when it appears in a planning title.",
      },
      {
        type: "paragraph",
        text: "This is especially important in supply chain and logistics research. National direction may be clear, but the operational signal often appears first in local infrastructure choices, cold-chain investment, and project approval rhythms.",
      },
    ],
    zh: {
      title: "产业规划的关键，不在愿景，在执行条件",
      subtitle:
        "规划是否可信，不取决于是否点中了正确产业，而取决于物流、资金和地方协调能否支撑它。",
      summary:
        "在200+规划与咨询项目中，一个反复出现的规律是：最薄弱环节很少是愿景本身，而是执行链条。",
      category: "产业与供应链",
      tags: ["产业规划", "物流", "供应链"],
      content: [
        {
          type: "paragraph",
          text: "产业规划文件在纸面上往往很有说服力。它会点出战略产业、对接国家优先级，并描绘未来产业集群。但政策和规划不是靠措辞被验证的，而是靠货物、资本、土地和行政注意力能否在系统中流动。",
        },
        { type: "heading", text: "三个执行检验最关键" },
        {
          type: "list",
          items: [
            "物流可行性：投入品、仓储和配送能否支撑所设计的产业链。",
            "财政可行性：首期由谁出资，回报慢于预期时谁来承担后果。",
            "制度可行性：哪些地方部门既有任务，又有动力在项目启动后继续推进。",
          ],
        },
        {
          type: "quote",
          text: "一个产业真正变实，不是因为写进了规划标题，而是因为园区、港口、仓储、采购和信贷开始围绕它重组。",
        },
        {
          type: "paragraph",
          text: "这在供应链和物流研究中尤其重要。国家方向可能很清楚，但操作层面的信号，往往先出现在地方基础设施选择、冷链投资和项目审批节奏里。",
        },
      ],
    },
  },
  {
    id: "local-fiscal-priority-ranking",
    slug: "local-fiscal-priority-ranking",
    title: "Under Fiscal Pressure, Local Governments Re-rank Their Priorities",
    subtitle:
      "Budget scarcity does not simply reduce spending. It reveals which goals local governments still treat as non-negotiable.",
    summary:
      "When fiscal conditions tighten, project selection becomes one of the clearest windows into real local government behavior.",
    category: "Local Government",
    tags: ["local government", "fiscal pressure", "project selection"],
    publishedAt: "2026-04-16",
    readingTime: "6 min read",
    author: "Robin Seun",
    featured: false,
    status: "published",
    content: [
      {
        type: "paragraph",
        text: "Fiscal pressure is often described as a macro risk, but its most useful analytical value appears at the local project level. When money becomes scarce, governments do not stop acting. They sort priorities.",
      },
      {
        type: "heading",
        text: "What survives budget tightening",
      },
      {
        type: "list",
        items: [
          "Projects with clearer funding channels and stronger political relevance.",
          "Spending that can be justified through employment, stability, or visible delivery.",
          "Programs that can be slowed, merged, or reframed without triggering immediate evaluation cost.",
        ],
      },
      {
        type: "paragraph",
        text: "That sorting process is why local behavior should be read as policy evidence. It shows where ambition meets constraint, and which official goals are operationally real.",
      },
    ],
    zh: {
      title: "财政压力下，地方政府如何重排优先级",
      subtitle:
        "预算紧张并不只是减少支出，它会暴露地方政府仍把哪些目标视为不可退让。",
      summary:
        "当财政约束收紧时，项目选择会成为观察地方政府真实行为最清楚的窗口之一。",
      category: "地方政府",
      tags: ["地方政府", "财政压力", "项目选择"],
      content: [
        {
          type: "paragraph",
          text: "财政压力常被当作宏观风险来描述，但它最有分析价值的地方，往往出现在地方项目层面。当资金变紧时，政府不会停止行动，而是开始排序优先级。",
        },
        { type: "heading", text: "预算收紧后什么会留下来" },
        {
          type: "list",
          items: [
            "资金通道更清楚、政治相关性更强的项目。",
            "能够通过就业、稳定或可见成效进行论证的支出。",
            "可以放缓、合并或改写表述，而不立即触发考核代价的项目。",
          ],
        },
        {
          type: "paragraph",
          text: "正是这种排序过程，让地方行为值得被当作政策证据来读。它展示了雄心如何遇到约束，也说明哪些官方目标在操作层面是真实的。",
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
