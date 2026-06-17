import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const adminLayout = fs.readFileSync(
	new URL("../app/admin/(protected)/layout.tsx", import.meta.url),
	"utf8",
);
const adminHome = fs.readFileSync(
	new URL("../app/admin/(protected)/page.tsx", import.meta.url),
	"utf8",
);

test("admin navigation reuses the public language switch", () => {
	assert.match(adminLayout, /LanguageToggle/);
	assert.match(adminLayout, /<LanguageToggle className=/);
});

test("admin navigation and dashboard expose bilingual interface copy", () => {
	assert.match(adminLayout, /LocalizedText/);
	assert.match(adminLayout, /zh=\{"\\u65b0\\u5efa\\u6587\\u7ae0"\}/);
	assert.match(adminLayout, /zh=\{"\\u9000\\u51fa\\u767b\\u5f55"\}/);
	assert.match(adminHome, /LocalizedText/);
	assert.match(adminHome, /zh=\{"\\u6587\\u7ae0"\}/);
	assert.match(adminHome, /zh=\{"\\u65b0\\u5efa\\u6587\\u7ae0"\}/);
});

test("admin article list exposes inline deletion with confirmation", () => {
	assert.match(adminHome, /deleteArticle/);
	assert.match(adminHome, /<form action=\{deleteArticle\}/);
	assert.match(adminHome, /name="id"/);
	assert.match(adminHome, /name="slug"/);
	assert.match(adminHome, /DeleteArticleButton/);
});
