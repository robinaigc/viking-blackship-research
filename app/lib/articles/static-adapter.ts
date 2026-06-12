import { analysisArticles } from "../../data/analysis";
import type { ArticleContentBlock } from "../../data/analysis";
import type { ArticleDocument, ArticleDocumentNode, ArticleRecord } from "./types";

function blockToNode(block: ArticleContentBlock): ArticleDocumentNode {
  if (block.type === "heading") {
    return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: block.text }] };
  }
  if (block.type === "quote") {
    return {
      type: "blockquote",
      content: [{ type: "paragraph", content: [{ type: "text", text: block.text }] }],
    };
  }
  if (block.type === "list") {
    return {
      type: "bulletList",
      content: block.items.map((item) => ({
        type: "listItem",
        content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
      })),
    };
  }
  return { type: "paragraph", content: [{ type: "text", text: block.text }] };
}

export function blocksToDocument(blocks: ArticleContentBlock[]): ArticleDocument {
  return { type: "doc", content: blocks.map(blockToNode) };
}

export function getStaticArticleRecords(): ArticleRecord[] {
  return analysisArticles.map((article) => {
    const publishedAt = `${article.publishedAt}T00:00:00.000Z`;
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      author: article.author,
      summary: article.summary,
      category: article.category,
      tags: article.tags,
      coverImageUrl: null,
      content: blocksToDocument(article.content),
      status: article.status,
      featured: article.featured,
      publishedAt: article.status === "published" ? publishedAt : null,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      readingTime: article.readingTime,
      localized: {
        title: article.zh.title,
        subtitle: article.zh.subtitle,
        summary: article.zh.summary,
        category: article.zh.category,
        tags: article.zh.tags,
        content: blocksToDocument(article.zh.content),
      },
    };
  });
}

