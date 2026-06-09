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
assert.match(home, /Read Analysis/);
assert.match(home, /Subscribe/);

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
  "China Policy Briefing",
  "Macro Tide Newsletter",
  "Analysis Method Toolkit",
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
  "login",
  "member center",
  "Canada local",
  "small business",
]) {
  assert.doesNotMatch(allApp, new RegExp(forbidden, "i"));
}

console.log("Site content contract passed.");
