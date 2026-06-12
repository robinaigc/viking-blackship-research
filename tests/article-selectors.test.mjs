import assert from "node:assert/strict";
import test from "node:test";

import {
  estimateReadingTime,
  selectFeaturedArticles,
  selectPublishedArticles,
} from "../app/lib/articles/selectors.ts";

const article = (slug, status, publishedAt, featured = false) => ({
  id: slug,
  slug,
  title: slug,
  author: "Robin Seun",
  summary: slug,
  category: "Analysis",
  tags: [],
  coverImageUrl: null,
  content: { type: "doc", content: [] },
  status,
  featured,
  publishedAt,
  createdAt: publishedAt ?? "2026-01-01T00:00:00.000Z",
  updatedAt: publishedAt ?? "2026-01-01T00:00:00.000Z",
});

test("estimates reading time for Chinese text", () => {
  const result = estimateReadingTime({
    ...article("chinese", "published", "2026-03-01T00:00:00.000Z"),
    content: {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "中".repeat(801) }] }],
    },
  });

  assert.equal(result, "3 min read");
});

test("selects only published articles newest first", () => {
  const result = selectPublishedArticles([
    article("older", "published", "2026-01-01T00:00:00.000Z"),
    article("draft", "draft", null),
    article("newer", "published", "2026-02-01T00:00:00.000Z"),
  ]);

  assert.deepEqual(result.map((item) => item.slug), ["newer", "older"]);
});

test("home page selection always uses the newest published articles", () => {
  const result = selectFeaturedArticles([
    article("featured", "published", "2026-01-01T00:00:00.000Z", true),
    article("newest", "published", "2026-03-01T00:00:00.000Z"),
    article("middle", "published", "2026-02-01T00:00:00.000Z"),
  ], 3);

  assert.deepEqual(result.map((item) => item.slug), ["newest", "featured", "middle"]);
});
