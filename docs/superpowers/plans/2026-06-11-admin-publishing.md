# Admin Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a private, owner-only writing dashboard that publishes rich articles to the existing public site and automatically updates article cards.

**Architecture:** Supabase provides email authentication, Postgres article storage, and image storage. Next.js server components and route handlers enforce the administrator allowlist; Tiptap supplies structured rich-text editing. Public pages read published database records when Supabase is configured and retain the current static articles as a no-outage fallback.

**Tech Stack:** Next.js 15, React 18, TypeScript, Supabase SSR/Postgres/Storage, Tiptap, Node test runner.

---

### Task 1: Content Domain and Validation

**Files:**
- Create: `app/lib/articles/types.ts`
- Create: `app/lib/articles/validation.ts`
- Test: `tests/article-validation.test.mjs`

- [ ] Write failing tests for slug normalization, required metadata, draft/published state, and safe Tiptap JSON.
- [ ] Run `pnpm test` and confirm the new tests fail because the domain modules do not exist.
- [ ] Implement the article types and validation helpers.
- [ ] Run `pnpm test` and confirm all tests pass.

### Task 2: Supabase Schema and Clients

**Files:**
- Create: `supabase/migrations/202606110001_admin_publishing.sql`
- Create: `app/lib/supabase/config.ts`
- Create: `app/lib/supabase/server.ts`
- Create: `app/lib/supabase/browser.ts`
- Modify: `.env.example`

- [ ] Define `articles` with unique slugs, draft/published status, JSON content, timestamps, and owner ID.
- [ ] Define private `article-images` storage policies and owner-only article RLS policies.
- [ ] Add typed browser/server clients that return a clear unconfigured state.
- [ ] Document `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAIL`.

### Task 3: Article Repository and Static Fallback

**Files:**
- Create: `app/lib/articles/repository.ts`
- Create: `app/lib/articles/static-adapter.ts`
- Modify: `app/data/analysis.ts`
- Test: `tests/article-repository.test.mjs`

- [ ] Write failing tests for published sorting, featured selection, slug lookup, and static fallback.
- [ ] Implement normalized public article records and repository functions.
- [ ] Preserve all current article URLs and content.

### Task 4: Owner Authentication

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/auth/callback/route.ts`
- Create: `app/lib/auth/admin.ts`
- Create: `app/admin/actions.ts`
- Create: `middleware.ts`

- [ ] Add email magic-link login and sign-out.
- [ ] Require an authenticated user whose email exactly matches `ADMIN_EMAIL`.
- [ ] Protect every `/admin` route on the server; never rely on a hidden URL.

### Task 5: Admin Article Management

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/articles/new/page.tsx`
- Create: `app/admin/articles/[id]/page.tsx`
- Create: `app/admin/articles/actions.ts`
- Create: `app/admin/components/article-form.tsx`

- [ ] List drafts and published articles with edit links.
- [ ] Create, update, publish, unpublish, and delete only after server-side authorization.
- [ ] Generate slugs from titles while allowing manual edits.
- [ ] Revalidate `/`, `/analysis`, article pages, sitemap, and admin pages after writes.

### Task 6: Rich Text and Image Upload

**Files:**
- Create: `app/admin/components/rich-text-editor.tsx`
- Create: `app/api/admin/images/route.ts`
- Create: `app/components/article-content.tsx`

- [ ] Configure Tiptap paragraphs, headings, bold, italic, links, lists, quotes, undo/redo, images, and tables.
- [ ] Restrict uploads to the owner, JPEG/PNG/WebP, and 5 MB.
- [ ] Store editor JSON and render it with an explicit node whitelist.

### Task 7: Public Pages and Automatic Cards

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/analysis/page.tsx`
- Modify: `app/analysis/[slug]/page.tsx`
- Modify: `app/components/analysis-card.tsx`
- Modify: `app/sitemap.ts`

- [ ] Make public pages async and read published repository records.
- [ ] Show newest published articles automatically on the homepage.
- [ ] Keep SEO metadata, structured data, related articles, and existing URLs working.

### Task 8: Migration and Delivery

**Files:**
- Create: `scripts/migrate-static-articles.mjs`
- Modify: `package.json`
- Modify: `README.md`

- [ ] Add an idempotent static-to-Supabase migration command.
- [ ] Run unit tests, content contract, dependency audit, and isolated production build.
- [ ] Connect/create Supabase and Vercel projects, apply SQL, configure environment variables, migrate articles, and verify a real owner login/publish flow.
- [ ] Commit and push the feature branch after end-to-end verification.
