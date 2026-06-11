import type { MetadataRoute } from "next";
import { getPublishedArticles } from "./data/analysis";

const baseUrl = "https://vikingblackship.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/analysis", "/products", "/about", "/subscribe"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...getPublishedArticles().map((article) => ({
      url: `${baseUrl}/analysis/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

