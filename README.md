# Viking Blackship

Robin Seun's bilingual personal research and consulting website, focused on
China's economy, policy signals, local government behavior, and industry.

## Stack

- Next.js 15 App Router
- React 18
- TypeScript
- Tailwind CSS
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

## Verification

```powershell
pnpm test
pnpm verify:content
pnpm build
pnpm audit --prod
```

## Content

- Article data: `app/data/analysis.ts`
- Product data: `app/data/products.ts`
- Static pages and UI: `app/`
