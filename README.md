# Viking Blackship

Robin Seun's bilingual personal research and consulting website, focused on
China's economy, policy signals, local government behavior, and industry.

## Stack

- Next.js 15 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage for owner-only article publishing
- Tiptap rich-text editor with images and tables
- Optional Beam Analytics
- Webhook-backed email subscriptions

## Local Development

```powershell
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` when analytics or subscriptions are
needed. The subscription form only reports success after
`SUBSCRIBE_WEBHOOK_URL` accepts the JSON request.

Without Supabase environment variables, the public site keeps serving the
existing static articles. The private publishing dashboard is available at
`/admin` after Supabase is configured.

## Private Article Publishing

1. Create a Supabase project and run
   `supabase/migrations/202606110001_admin_publishing.sql` in its SQL editor.
2. Add `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and
   `ADMIN_EMAIL` to `.env.local` and Vercel.
3. Add `https://YOUR_DOMAIN/admin/auth/callback` to the Supabase Auth redirect
   URLs. Add the localhost callback while developing locally.
4. Visit `/admin/login` and request a magic link using the exact
   `ADMIN_EMAIL`. Other email addresses are rejected.
5. After the first successful login, run `pnpm migrate:articles` once to copy
   the existing static articles into Supabase. The command is idempotent.

Published articles appear automatically on `/analysis`; the three newest
featured articles also appear on the home page. Drafts remain private.

## Verification

```powershell
pnpm test
pnpm verify:content
pnpm build
pnpm audit --prod
```

## Content

- Article data: `app/data/analysis.ts`
- Article administration: `app/admin/`
- Supabase migration: `supabase/migrations/`
- Product data: `app/data/products.ts`
- Static pages and UI: `app/`
