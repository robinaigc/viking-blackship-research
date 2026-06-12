import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getAuthCallbackCredentials } from "../app/lib/auth/callback.mjs";

test("reads an implicit Supabase session from the URL fragment", () => {
  assert.deepEqual(
    getAuthCallbackCredentials(
      "https://example.com/admin/auth/callback#access_token=access&refresh_token=refresh&type=magiclink",
    ),
    { kind: "session", accessToken: "access", refreshToken: "refresh" },
  );
});

test("reads a PKCE authorization code", () => {
  assert.deepEqual(
    getAuthCallbackCredentials(
      "https://example.com/admin/auth/callback?code=authorization-code",
    ),
    { kind: "code", code: "authorization-code" },
  );
});

test("reads a token hash callback", () => {
  assert.deepEqual(
    getAuthCallbackCredentials(
      "https://example.com/admin/auth/callback?token_hash=hash&type=magiclink",
    ),
    { kind: "otp", tokenHash: "hash", type: "magiclink" },
  );
});

test("rejects incomplete callback URLs", () => {
  assert.deepEqual(
    getAuthCallbackCredentials("https://example.com/admin/auth/callback"),
    { kind: "missing" },
  );
});

test("captures callback credentials before creating the Supabase browser client", () => {
  const callbackPage = fs.readFileSync(
    new URL("../app/admin/auth/callback/page.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(
    callbackPage.indexOf("getAuthCallbackCredentials(window.location.href)") <
      callbackPage.indexOf("createSupabaseBrowserClient()"),
  );
});
