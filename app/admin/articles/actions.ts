"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/auth/admin";
import { normalizeArticleInput } from "../../lib/articles/validation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

function readArticleForm(formData: FormData) {
  let content: unknown;
  try {
    content = JSON.parse(String(formData.get("content") ?? ""));
  } catch {
    throw new Error("Article content is invalid.");
  }

  return normalizeArticleInput({
    title: formData.get("title"),
    slug: formData.get("slug"),
    author: formData.get("author"),
    summary: formData.get("summary"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    coverImageUrl: formData.get("coverImageUrl"),
    content,
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
  });
}

function databasePayload(article: ReturnType<typeof readArticleForm>, ownerId: string) {
  return {
    owner_id: ownerId,
    slug: article.slug,
    title: article.title,
    author: article.author,
    summary: article.summary,
    category: article.category,
    tags: article.tags,
    cover_image_url: article.coverImageUrl,
    content: article.content,
    status: article.status,
    featured: article.featured,
  };
}

function refreshArticlePaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/analysis");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/analysis/${slug}`);
}

export async function createArticle(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=not-configured");

  let article: ReturnType<typeof readArticleForm>;
  let savedArticle: { id: string; slug: string };
  try {
    article = readArticleForm(formData);
    const { data, error } = await supabase
      .from("articles")
      .insert(databasePayload(article, admin.id))
      .select("id, slug")
      .single();
    if (error) throw error;
    savedArticle = data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create article.";
    redirect(`/admin/articles/new?error=${encodeURIComponent(message)}`);
  }
  refreshArticlePaths(savedArticle.slug);
  redirect(`/admin/articles/${savedArticle.id}?saved=1`);
}

export async function updateArticle(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=not-configured");
  const id = String(formData.get("id") ?? "");
  const previousSlug = String(formData.get("previousSlug") ?? "");

  let article: ReturnType<typeof readArticleForm>;
  try {
    article = readArticleForm(formData);
    const { error } = await supabase
      .from("articles")
      .update(databasePayload(article, admin.id))
      .eq("id", id)
      .eq("owner_id", admin.id);
    if (error) throw error;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update article.";
    redirect(`/admin/articles/${id}?error=${encodeURIComponent(message)}`);
  }
  refreshArticlePaths(previousSlug);
  refreshArticlePaths(article.slug);
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=not-configured");
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const { error } = await supabase.from("articles").delete().eq("id", id).eq("owner_id", admin.id);
  if (error) redirect(`/admin/articles/${id}?error=${encodeURIComponent(error.message)}`);
  refreshArticlePaths(slug);
  redirect("/admin?deleted=1");
}
