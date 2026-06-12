import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/202606110001_admin_publishing.sql",
  import.meta.url,
);

test("Supabase migration lets administrators read their own membership", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  assert.match(sql, /on public\.site_admins for select\s+using \(user_id = auth\.uid\(\)\)/i);
});

test("Supabase migration keeps drafts private and published articles public", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  assert.match(sql, /status = 'published'/i);
  assert.match(sql, /owner_id = auth\.uid\(\)/i);
});
