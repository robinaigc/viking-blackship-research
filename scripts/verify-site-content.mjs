import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const requiredFiles = [
  "app/page.tsx",
  "app/analysis/page.tsx",
  "app/analysis/[slug]/page.tsx",
  "app/products/page.tsx",
  "app/about/page.tsx",
  "app/subscribe/page.tsx",
  "app/data/analysis.ts",
  "app/data/products.ts",
  "app/components/subscribe-form.tsx",
  "public/viking-blackship-logo.png",
];

for (const file of requiredFiles) {
  assert.ok(exists(file), `${file} should exist`);
}

const home = read("app/page.tsx");
assert.match(home, /Robin Seun/);
assert.match(home, /Sharp, evidence-based analysis on China/);
assert.match(home, /Viking Blackship/);
assert.match(home, /Viking Blackship Consulting/);
assert.match(home, /Featured Analysis/);
assert.match(home, /Subscribe/);

const packageJson = JSON.parse(read("package.json"));
assert.ok(
  Number(packageJson.dependencies.next.split(".")[0]) >= 15,
  "Next.js should be on a supported security-patched major version",
);
for (const legacyDependency of [
  "@next/font",
  "@next/mdx",
  "contentlayer",
  "markdown-wasm",
  "next-contentlayer",
]) {
  assert.equal(
    packageJson.dependencies[legacyDependency],
    undefined,
    `${legacyDependency} should not remain in the production dependency tree`,
  );
}

const nextConfig = read("next.config.mjs");
for (const securityHeader of [
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
]) {
  assert.match(nextConfig, new RegExp(securityHeader));
}

const subscribeForm = read("app/components/subscribe-form.tsx");
assert.match(subscribeForm, /fetch\("\/api\/subscribe"/);
assert.doesNotMatch(subscribeForm, /console\.info/);
assert.match(subscribeForm, /aria-live/);

assert.ok(exists("app/api/subscribe/route.ts"), "subscribe API route should exist");
const subscribeRoute = read("app/api/subscribe/route.ts");
assert.match(subscribeRoute, /SUBSCRIBE_WEBHOOK_URL/);
assert.match(subscribeRoute, /status: 503/);

for (const seoFile of ["app/sitemap.ts", "app/robots.ts", "app/manifest.ts"]) {
  assert.ok(exists(seoFile), `${seoFile} should exist`);
}

const layout = read("app/layout.tsx");
assert.match(layout, /alternates/);
assert.match(layout, /\/og\.png/);

for (const seoFile of [
  "app/layout.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "app/analysis/[slug]/page.tsx",
]) {
  assert.doesNotMatch(
    read(seoFile),
    /https:\/\/vikingblackship\.com/,
    `${seoFile} should use the configured public site URL`,
  );
}

const language = read("app/components/language.tsx");
assert.match(language, /<button/);
assert.doesNotMatch(language, /role="button"/);

const navigation = read("app/components/nav.tsx");
for (const label of ["Home", "Analysis", "Products", "About", "Subscribe"]) {
  assert.match(navigation, new RegExp(`label: "${label}"`), `nav should include ${label}`);
}

const analysisData = read("app/data/analysis.ts");
for (const field of [
  "id",
  "slug",
  "title",
  "subtitle",
  "summary",
  "category",
  "tags",
  "publishedAt",
  "readingTime",
  "author",
  "content",
  "featured",
  "status",
]) {
  assert.match(analysisData, new RegExp(`${field}:`), `article data should include ${field}`);
}

const productData = read("app/data/products.ts");
for (const product of [
  "Policy Research & Reports",
  "Viking Blackship Brief",
  "Planning & Industry Consulting",
]) {
  assert.match(productData, new RegExp(product), `product data should include ${product}`);
}

const allApp = fs
  .readdirSync(path.join(root, "app"), { recursive: true })
  .filter((file) => String(file).endsWith(".tsx") || String(file).endsWith(".ts"))
  .map((file) => read(path.join("app", String(file))))
  .join("\n");

for (const forbidden of [
  "会员",
  "在线支付",
  "member center",
  "Canada local",
  "small business",
]) {
  assert.doesNotMatch(allApp, new RegExp(forbidden, "i"));
}

console.log("Site content contract passed.");
