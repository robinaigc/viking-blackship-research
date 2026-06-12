import { analysisArticles } from "../app/data/analysis.ts";

const projectRef = process.env.SUPABASE_PROJECT_REF ?? "hkzgzpaqgmosurjlgcck";
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!adminEmail) throw new Error("ADMIN_EMAIL is required.");
if (!accessToken) throw new Error("SUPABASE_ACCESS_TOKEN is required.");

async function query(sql) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );
  if (!response.ok) throw new Error(`Supabase query failed: ${await response.text()}`);
  return response.json();
}

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

function sqlTextArray(values) {
  return `array[${values.map(sqlLiteral).join(",")}]::text[]`;
}

function blocksToDocument(blocks) {
  return {
    type: "doc",
    content: blocks.map((block) => {
      if (block.type === "heading") {
        return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: block.text }] };
      }
      if (block.type === "quote") {
        return { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: block.text }] }] };
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
      return { type: "paragraph", content: [{ type: "text", text: block.text }] };
    }),
  };
}

const users = await query(
  `select id::text, email from auth.users where lower(email) = lower(${sqlLiteral(adminEmail)}) limit 1`,
);
if (!users.length) throw new Error(`No Supabase Auth user exists for ${adminEmail}.`);
const ownerId = users[0].id;

await query(`insert into public.site_admins (user_id) values (${sqlLiteral(ownerId)}::uuid)
on conflict (user_id) do nothing`);

for (const article of analysisArticles) {
  const publishedAt = article.status === "published" ? `${article.publishedAt}T00:00:00.000Z` : null;
  await query(`insert into public.articles
    (owner_id, slug, title, author, summary, category, tags, cover_image_url, content, status, featured, published_at)
    values (
      ${sqlLiteral(ownerId)}::uuid,
      ${sqlLiteral(article.slug)},
      ${sqlLiteral(article.title)},
      ${sqlLiteral(article.author)},
      ${sqlLiteral(article.summary)},
      ${sqlLiteral(article.category)},
      ${sqlTextArray(article.tags)},
      null,
      ${sqlJson(blocksToDocument(article.content))},
      ${sqlLiteral(article.status)},
      ${article.featured ? "true" : "false"},
      ${publishedAt ? `${sqlLiteral(publishedAt)}::timestamptz` : "null"}
    )
    on conflict (slug) do update set
      owner_id = excluded.owner_id,
      title = excluded.title,
      author = excluded.author,
      summary = excluded.summary,
      category = excluded.category,
      tags = excluded.tags,
      content = excluded.content,
      status = excluded.status,
      featured = excluded.featured,
      published_at = excluded.published_at`);
}

const result = await query(`select
  (select count(*)::int from public.site_admins) as admin_count,
  (select count(*)::int from public.articles) as article_count`);
console.log(JSON.stringify(result[0]));
