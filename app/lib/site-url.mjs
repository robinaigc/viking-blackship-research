const fallbackSiteUrl = "https://viking-blackship-research.vercel.app";

export function getSiteUrl(value = process.env.NEXT_PUBLIC_APP_URL) {
  const candidate = value?.trim().replace(/\/$/, "");
  if (!candidate) return fallbackSiteUrl;

  try {
    const url = new URL(candidate);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.origin;
    }
  } catch {
    // Fall through to the known working production URL.
  }

  return fallbackSiteUrl;
}
