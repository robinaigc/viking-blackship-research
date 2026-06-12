import type { ArticleDocumentNode, ArticleRecord } from "./types";

export function selectPublishedArticles(articles: ArticleRecord[]) {
  return articles
    .filter((article) => article.status === "published")
    .sort((a, b) => {
      const aDate = a.publishedAt ?? a.createdAt;
      const bDate = b.publishedAt ?? b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
}

export function selectFeaturedArticles(articles: ArticleRecord[], limit = 3) {
  const published = selectPublishedArticles(articles);
  if (published.length <= 1) return published.slice(0, limit);
  const [newest, ...rest] = published;
  const featured = rest.filter((article) => article.featured);
  const remainder = rest.filter((article) => !article.featured);
  return [newest, ...featured, ...remainder].slice(0, limit);
}

export function estimateReadingTime(article: ArticleRecord) {
  if (article.readingTime) return article.readingTime;
  const collectText = (node: ArticleDocumentNode): string => {
    return [node.text ?? "", ...(node.content ?? []).map(collectText)].join(" ");
  };
  const text = collectText(article.content);
  const cjkCharacters = text.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0;
  const latinWords = text
    .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = latinWords / 220 + cjkCharacters / 400;
  return `${Math.max(1, Math.ceil(minutes))} min read`;
}
