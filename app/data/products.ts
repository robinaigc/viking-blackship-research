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
    id: "policy-research-reports",
    name: "Policy Research & Reports",
    slug: "policy-research-reports",
    summary:
      "Macro and policy research reports for institutions that need evidence, not headlines.",
    description:
      "Custom research on China's economy, policy signals, government behavior, and industrial issues. Built for readers who need structured analysis—policy objectives, implementation mechanisms, cost allocation, and data validation—not news summaries.",
    type: "Research & Reports",
    status: "Available",
    targetAudience:
      "Government agencies, enterprises, research teams, and investors who need policy interpretation grounded in documents, data, and institutional context.",
    callToActionText: "Get in Touch",
    callToActionLink: "/subscribe?source=policy-research-reports",
    zh: {
      name: "政策研究与报告",
      summary: "为需要证据而非标题的机构提供宏观经济与政策研究报告。",
      description:
        "围绕中国经济、政策信号、政府行为与产业问题提供定制化研究，重点回答政策目标是否真实、执行机制是否可行、成本由谁承担、官方叙事与数据是否一致。",
      type: "研究与报告",
      status: "可咨询",
      targetAudience:
        "需要基于政策文本、数据证据和制度背景做判断的政府机构、企业、研究团队与投资者。",
      callToActionText: "联系咨询",
    },
  },
  {
    id: "viking-blackship-brief",
    name: "Viking Blackship Brief",
    slug: "viking-blackship-brief",
    summary:
      "Concise analysis on China's macroeconomy, policy signals, and government behavior.",
    description:
      "A recurring brief on policy language, macro data, local government behavior, and the structural logic behind official narratives. Written for readers who want fewer headlines and more interpretive depth.",
    type: "Newsletter / Brief",
    status: "Subscribe",
    targetAudience:
      "Analysts, operators, and long-term observers who follow China's economy and policy without wanting daily noise.",
    callToActionText: "Subscribe",
    callToActionLink: "/subscribe?source=viking-blackship-brief",
    zh: {
      name: "维京黑船简报",
      summary: "关于中国宏观经济、政策信号与政府行为的简明分析。",
      description:
        "持续追踪政策语言、宏观数据、地方政府行为，以及官方叙事背后的结构性逻辑，适合希望减少噪音、获得更深解释的读者。",
      type: "简报 / 通讯",
      status: "订阅",
      targetAudience:
        "关注中国经济与政策、但不想被标题党淹没的分析师、从业者和长期观察者。",
      callToActionText: "订阅",
    },
  },
  {
    id: "planning-industry-consulting",
    name: "Planning & Industry Consulting",
    slug: "planning-industry-consulting",
    summary:
      "Industry planning, logistics, supply chain, and regional development consulting.",
    description:
      "Planning and consulting across macro policy, industrial layout, logistics systems, and local government projects. Drawing on 200+ completed planning and consulting engagements and repeated research submissions to NDRC and MOFCOM.",
    type: "Planning & Consulting",
    status: "Available",
    targetAudience:
      "Local governments, industrial parks, logistics operators, and enterprises that need planning support tied to policy reality and implementation feasibility.",
    callToActionText: "Learn More",
    callToActionLink: "/about",
    zh: {
      name: "规划与产业咨询",
      summary: "产业规划、物流与供应链、区域发展相关规划咨询。",
      description:
        "覆盖宏观政策、产业布局、物流体系与地方政府项目规划咨询，基于200+规划与咨询项目经验，以及多次向国家发改委、商务部提交研究报告的实务背景。",
      type: "规划咨询",
      status: "可咨询",
      targetAudience:
        "需要把政策判断转化为可执行方案的地方政府、产业园区、物流企业与产业投资主体。",
      callToActionText: "了解更多",
    },
  },
];
