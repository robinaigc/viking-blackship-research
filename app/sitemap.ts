import type { MetadataRoute } from "next";
import { getPublicArticles } from "./lib/articles/repository";
import { getSiteUrl } from "./lib/site-url.mjs";

const baseUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/analysis", "/products", "/about", "/subscribe"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...(await getPublicArticles()).map((article) => ({
      url: `${baseUrl}/analysis/${article.slug}`,
      lastModified: new Date(article.publishedAt ?? article.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
