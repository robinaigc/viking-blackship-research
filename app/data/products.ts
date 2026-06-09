export type Product = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  type: string;
  status: "Coming Soon" | "Available" | "Subscribe";
  targetAudience: string;
  callToActionText: string;
  callToActionLink: string;
  zh: {
    name: string;
    summary: string;
    description: string;
    type: string;
    status: string;
    targetAudience: string;
    callToActionText: string;
  };
};

export const products: Product[] = [
  {
    id: "china-policy-briefing",
    name: "China Policy Briefing",
    slug: "china-policy-briefing",
    summary: "Focused briefings on Chinese policy signals and implementation.",
    description:
      "A future home for policy briefings, thematic analysis, and custom research products on China's economic and institutional signals.",
    type: "Research briefing",
    status: "Coming Soon",
    targetAudience:
      "Readers who need concise, evidence-based context on policy direction, local implementation, and economic implications.",
    callToActionText: "Get Updates",
    callToActionLink: "/subscribe?source=china-policy-briefing",
    zh: {
      name: "中国政策简报",
      summary: "聚焦中国政策信号与执行机制的研究简报。",
      description:
        "未来用于发布政策简报、专题分析和定制化研究产品，关注中国经济与制度信号。",
      type: "研究简报",
      status: "即将推出",
      targetAudience:
        "需要快速理解政策方向、地方执行和经济影响的读者。",
      callToActionText: "获取更新",
    },
  },
  {
    id: "macro-tide-newsletter",
    name: "Macro Tide Newsletter",
    slug: "macro-tide-newsletter",
    summary: "A concise newsletter on China's economy and policy signals.",
    description:
      "A future newsletter for recurring analysis of macro data, policy language, local government behavior, and industry movement.",
    type: "Newsletter",
    status: "Subscribe",
    targetAudience:
      "Operators, analysts, and curious readers who want a sharper read on China without noise.",
    callToActionText: "Subscribe",
    callToActionLink: "/subscribe?source=macro-tide-newsletter",
    zh: {
      name: "宏观潮汐 Newsletter",
      summary: "关于中国经济与政策信号的简明通讯。",
      description:
        "未来用于持续追踪宏观数据、政策语言、地方政府行为和产业变化。",
      type: "Newsletter",
      status: "订阅",
      targetAudience:
        "希望减少噪音、获得更清晰中国观察的操作者、分析师和长期读者。",
      callToActionText: "订阅",
    },
  },
  {
    id: "analysis-method-toolkit",
    name: "Analysis Method Toolkit",
    slug: "analysis-method-toolkit",
    summary: "Frameworks for reading policy, data, and institutional signals.",
    description:
      "A future toolkit for analysis methods, source filtering, policy interpretation, and repeatable research workflows.",
    type: "Toolkit / Course",
    status: "Coming Soon",
    targetAudience:
      "Readers who want to build a practical method for policy and macro analysis.",
    callToActionText: "Learn More",
    callToActionLink: "/products#analysis-method-toolkit",
    zh: {
      name: "分析方法工具包",
      summary: "用于阅读政策、数据和制度信号的方法框架。",
      description:
        "未来承载分析方法论、信息源筛选、政策解读方法和可重复研究流程。",
      type: "工具包 / 课程",
      status: "即将推出",
      targetAudience:
        "希望建立实用政策与宏观分析方法的读者。",
      callToActionText: "了解更多",
    },
  },
];
