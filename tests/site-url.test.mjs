import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrl } from "../app/lib/site-url.mjs";

test("uses the configured public site URL without a trailing slash", () => {
  assert.equal(getSiteUrl("https://example.com/"), "https://example.com");
});

test("falls back to the live Vercel domain when no custom domain is configured", () => {
  assert.equal(
    getSiteUrl(""),
    "https://viking-blackship-research.vercel.app",
  );
});

test("rejects non-http site URL values", () => {
  assert.equal(
    getSiteUrl("javascript:alert(1)"),
    "https://viking-blackship-research.vercel.app",
  );
});
