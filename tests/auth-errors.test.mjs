import assert from "node:assert/strict";
import test from "node:test";
import { getMagicLinkErrorKey } from "../app/lib/auth/errors.mjs";

test("reports Supabase email cooldowns separately", () => {
  assert.equal(
    getMagicLinkErrorKey({ code: "over_email_send_rate_limit", status: 429 }),
    "rate-limited",
  );
});

test("keeps other authentication errors generic", () => {
  assert.equal(
    getMagicLinkErrorKey({ code: "unexpected_failure", status: 500 }),
    "login-failed",
  );
});
