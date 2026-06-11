import { NextResponse } from "next/server";
import { normalizeSubscription } from "../../lib/subscription";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4096) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let subscription;
  try {
    subscription = normalizeSubscription(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid subscription.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const webhookUrl = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Subscriptions are not configured yet." },
      { status: 503 },
    );
  }

  let target: URL;
  try {
    target = new URL(webhookUrl);
  } catch {
    return NextResponse.json({ error: "Subscription service is unavailable." }, { status: 503 });
  }

  if (target.protocol !== "https:" && target.hostname !== "localhost") {
    return NextResponse.json({ error: "Subscription service is unavailable." }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.SUBSCRIBE_WEBHOOK_SECRET
          ? { authorization: `Bearer ${process.env.SUBSCRIBE_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({
        ...subscription,
        subscribedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Subscription service is unavailable." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Subscription service is unavailable." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
