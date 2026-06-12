export type ArticleStatus = "draft" | "published";

export type ArticleDocumentNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ArticleDocumentNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
};

export type ArticleDocument = ArticleDocumentNode & { type: "doc" };

export type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  author: string;
  summary: string;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  content: ArticleDocument;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subtitle?: string;
  readingTime?: string;
  localized?: {
    title: string;
    subtitle: string;
    summary: string;
    category: string;
    tags: string[];
    content: ArticleDocument;
  };
};

export type ArticleInput = {
  title?: unknown;
  slug?: unknown;
  author?: unknown;
  summary?: unknown;
  category?: unknown;
  tags?: unknown;
  coverImageUrl?: unknown;
  content?: unknown;
  status?: unknown;
  featured?: unknown;
};

export type NormalizedArticleInput = Omit<
  ArticleRecord,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;
