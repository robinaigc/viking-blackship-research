export type SubscriptionInput = {
  email?: unknown;
  source?: unknown;
  website?: unknown;
};

export type Subscription = {
  email: string;
  source: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sourcePattern = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function normalizeSubscription(input: SubscriptionInput): Subscription {
  if (typeof input.website === "string" && input.website.trim()) {
    throw new Error("Invalid submission.");
  }

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email.length > 254 || !emailPattern.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const source = typeof input.source === "string" ? input.source.trim().toLowerCase() : "";
  if (!sourcePattern.test(source)) {
    throw new Error("Invalid subscription source.");
  }

  return { email, source };
}

