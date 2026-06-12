import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeArticleInput,
  slugifyArticleTitle,
  validateArticleDocument,
} from "../app/lib/articles/validation.ts";

test("slugifies English and Chinese article titles", () => {
  assert.equal(slugifyArticleTitle("Policy Signals & Local Action"), "policy-signals-local-action");
  assert.equal(slugifyArticleTitle("中国经济 2026"), "中国经济-2026");
});

test("removes apostrophes from article slugs", () => {
  assert.equal(slugifyArticleTitle("China's Policy\u2019s Turn"), "chinas-policys-turn");
});

test("normalizes a publishable article", () => {
  const article = normalizeArticleInput({
    title: "  Policy Signals  ",
    slug: " Policy Signals ",
    author: " Robin Seun ",
    summary: " A concise summary. ",
    category: "Policy Signals",
    tags: "policy, local government, policy",
    status: "published",
    featured: true,
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Body" }] }] },
  });

  assert.deepEqual(article.tags, ["policy", "local government"]);
  assert.equal(article.slug, "policy-signals");
  assert.equal(article.status, "published");
});

test("rejects published articles without meaningful content", () => {
  assert.throws(
    () =>
      normalizeArticleInput({
        title: "Empty",
        author: "Robin Seun",
        summary: "Summary",
        status: "published",
        content: { type: "doc", content: [] },
      }),
    /content/i,
  );
});

test("rejects unsupported rich text nodes", () => {
  assert.throws(
    () => validateArticleDocument({ type: "doc", content: [{ type: "script", text: "bad" }] }),
    /unsupported/i,
  );
});

test("rejects unsafe cover image URLs", () => {
  assert.throws(
    () =>
      normalizeArticleInput({
        title: "A valid title",
        author: "Robin Seun",
        summary: "A valid summary",
        content: { type: "doc", content: [{ type: "paragraph" }] },
        coverImageUrl: "javascript:alert(1)",
      }),
    /HTTP or HTTPS/,
  );
});
