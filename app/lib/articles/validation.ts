import type {
  ArticleDocument,
  ArticleDocumentNode,
  ArticleInput,
  NormalizedArticleInput,
} from "./types";

const allowedNodes = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "hardBreak",
  "horizontalRule",
  "image",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
]);

const allowedMarks = new Set(["bold", "italic", "strike", "code", "link"]);

function cleanText(value: unknown, field: string, maxLength: number, required = true) {
  const text = typeof value === "string" ? value.trim() : "";
  if (required && !text) throw new Error(`${field} is required.`);
  if (text.length > maxLength) throw new Error(`${field} is too long.`);
  return text;
}

export function slugifyArticleTitle(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function validateNode(node: unknown): asserts node is ArticleDocumentNode {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new Error("Article content contains an invalid node.");
  }

  const candidate = node as ArticleDocumentNode;
  if (!allowedNodes.has(candidate.type)) {
    throw new Error(`Unsupported article content node: ${candidate.type || "unknown"}.`);
  }

  if (candidate.text !== undefined && typeof candidate.text !== "string") {
    throw new Error("Article text nodes must contain text.");
  }

  for (const mark of candidate.marks ?? []) {
    if (!allowedMarks.has(mark.type)) {
      throw new Error(`Unsupported article content mark: ${mark.type}.`);
    }
  }

  for (const child of candidate.content ?? []) validateNode(child);
}

export function validateArticleDocument(value: unknown): ArticleDocument {
  validateNode(value);
  if (value.type !== "doc") throw new Error("Article content must be a document.");
  return value as ArticleDocument;
}

function hasMeaningfulContent(node: ArticleDocumentNode): boolean {
  if (node.type === "image" || node.type === "table") return true;
  if (typeof node.text === "string" && node.text.trim().length > 0) return true;
  return (node.content ?? []).some(hasMeaningfulContent);
}

export function normalizeArticleInput(input: ArticleInput): NormalizedArticleInput {
  const title = cleanText(input.title, "Title", 180);
  const author = cleanText(input.author, "Author", 120);
  const summary = cleanText(input.summary, "Summary", 500);
  const slug = slugifyArticleTitle(
    typeof input.slug === "string" && input.slug.trim() ? input.slug : title,
  );
  if (!slug) throw new Error("Slug is required.");

  const status = input.status === "published" ? "published" : "draft";
  const content = validateArticleDocument(input.content ?? { type: "doc", content: [] });
  if (status === "published" && !hasMeaningfulContent(content)) {
    throw new Error("Published articles require content.");
  }

  const rawTags = Array.isArray(input.tags)
    ? input.tags
    : typeof input.tags === "string"
      ? input.tags.split(",")
      : [];
  const tags = [...new Set(rawTags.map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 12);
  const rawCoverImageUrl =
    typeof input.coverImageUrl === "string" ? input.coverImageUrl.trim() : "";
  if (rawCoverImageUrl && !/^https?:\/\//i.test(rawCoverImageUrl)) {
    throw new Error("Cover image URL must use HTTP or HTTPS.");
  }

  return {
    title,
    slug,
    author,
    summary,
    category: cleanText(input.category, "Category", 100, false) || "Analysis",
    tags,
    coverImageUrl: rawCoverImageUrl || null,
    content,
    status,
    featured: input.featured === true,
  };
}
