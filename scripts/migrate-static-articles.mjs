import { createClient } from "@supabase/supabase-js";
import { analysisArticles } from "../app/data/analysis.ts";

const requiredEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAIL",
];

for (const name of requiredEnvironment) {
  if (!process.env[name]?.trim()) {
    throw new Error(`${name} is required.`);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

function blocksToDocument(blocks) {
  return {
    type: "doc",
    content: blocks.map((block) => {
      if (block.type === "heading") {
        return {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: block.text }],
        };
      }
      if (block.type === "quote") {
        return {
          type: "blockquote",
          content: [{ type: "paragraph", content: [{ type: "text", text: block.text }] }],
        };
      }
      if (block.type === "list") {
        return {
          type: "bulletList",
          content: block.items.map((item) => ({
            type: "listItem",
            content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
          })),
        };
      }
      return {
        type: "paragraph",
        content: [{ type: "text", text: block.text }],
      };
    }),
  };
}

async function findAdminUser(email) {
  const { data: membership, error: membershipError } = await supabase
    .from("site_admins")
    .select("user_id")
    .limit(1)
    .maybeSingle();
  if (membershipError) throw membershipError;
  if (membership?.user_id) return { id: membership.user_id, email };

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < 100) return null;
  }
}

const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
const admin = await findAdminUser(adminEmail);

if (!admin) {
  throw new Error(
    `No Supabase Auth user exists for ${adminEmail}. Sign in through /admin/login once, then rerun this command.`,
  );
}

const { error: adminError } = await supabase
  .from("site_admins")
  .upsert({ user_id: admin.id }, { onConflict: "user_id" });
if (adminError) throw adminError;

const rows = analysisArticles.map((article) => ({
  owner_id: admin.id,
  slug: article.slug,
  title: article.title,
  author: article.author,
  summary: article.summary,
  category: article.category,
  tags: article.tags,
  cover_image_url: null,
  content: blocksToDocument(article.content),
  status: article.status,
  featured: article.featured,
  published_at:
    article.status === "published" ? `${article.publishedAt}T00:00:00.000Z` : null,
}));

const { error } = await supabase.from("articles").upsert(rows, { onConflict: "slug" });
if (error) throw error;

console.log(`Migrated ${rows.length} static articles for ${adminEmail}.`);
