import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSubscription } from "../app/lib/subscription.ts";

test("normalizes a valid subscription", () => {
  assert.deepEqual(
    normalizeSubscription({
      email: "  Reader@Example.com ",
      source: "article-policy-signals",
      website: "",
    }),
    {
      email: "reader@example.com",
      source: "article-policy-signals",
    },
  );
});

test("rejects invalid email addresses", () => {
  assert.throws(
    () => normalizeSubscription({ email: "not-an-email", source: "home" }),
    /valid email/i,
  );
});

test("rejects honeypot submissions", () => {
  assert.throws(
    () =>
      normalizeSubscription({
        email: "reader@example.com",
        source: "home",
        website: "spam.example",
      }),
    /invalid submission/i,
  );
});
