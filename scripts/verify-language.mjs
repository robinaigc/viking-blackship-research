import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const language = read("app/components/language.tsx");
const nav = read("app/components/nav.tsx");
const layout = read("app/layout.tsx");
const home = read("app/page.tsx");
const articles = read("app/data/analysis.ts");
const products = read("app/data/products.ts");

assert.match(language, /LanguageProvider/, "language provider should exist");
assert.match(language, /LanguageToggle/, "language toggle should exist");
assert.match(language, /LocalizedText/, "localized text helper should exist");
assert.match(language, /localStorage/, "language choice should be remembered");
assert.match(language, /"en"/, "default language should support English");
assert.match(language, /"zh"/, "language should support Chinese");

assert.match(layout, /LanguageProvider/, "layout should wrap the app in LanguageProvider");
assert.match(nav, /<LanguageToggle/, "nav should include the language toggle");
assert.match(nav, /Subscribe/, "nav should keep Subscribe before the language toggle");
assert.match(home, /LocalizedText/, "home should use localized hero copy");
assert.match(home, /<LanguageToggle/, "home hero nav should include the language toggle");
assert.match(articles, /zh:/, "article data should include Chinese copy");
assert.match(products, /zh:/, "product data should include Chinese copy");

console.log("Language contract passed.");
