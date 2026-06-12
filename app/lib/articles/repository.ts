import "server-only";

import type { ArticleRecord } from "./types";
import { selectFeaturedArticles, selectPublishedArticles } from "./selectors";
import { getStaticArticleRecords } from "./static-adapter";
import { createSupabasePublicClient } from "../supabase/server";

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  author: string;
  summary: string;
  category: string;
  tags: string[] | null;
  cover_image_url: string | null;
  content: ArticleRecord["content"];
  status: ArticleRecord["status"];
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapArticleRow(row: ArticleRow): ArticleRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author,
    summary: row.summary,
    category: row.category,
    tags: row.tags ?? [],
    coverImageUrl: row.cover_image_url,
    content: row.content,
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchPublishedFromSupabase(): Promise<ArticleRecord[] | null> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Unable to load Supabase articles; using static fallback.", error.message);
    return null;
  }
  return (data as ArticleRow[]).map(mapArticleRow);
}

export async function getPublicArticles() {
  const databaseArticles = await fetchPublishedFromSupabase();
  return selectPublishedArticles(databaseArticles ?? getStaticArticleRecords());
}

export async function getFeaturedPublicArticles(limit = 3) {
  return selectFeaturedArticles(await getPublicArticles(), limit);
}

export async function getPublicArticleBySlug(slug: string) {
  return (await getPublicArticles()).find((article) => article.slug === slug);
}

export async function getRelatedPublicArticles(article: ArticleRecord, limit = 3) {
  return (await getPublicArticles())
    .filter((candidate) => candidate.slug !== article.slug)
    .filter(
      (candidate) =>
        candidate.category === article.category ||
        candidate.tags.some((tag) => article.tags.includes(tag)),
    )
    .slice(0, limit);
}
