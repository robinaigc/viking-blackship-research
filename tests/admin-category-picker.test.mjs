import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const articleForm = fs.readFileSync(
	new URL("../app/admin/components/article-form.tsx", import.meta.url),
	"utf8",
);
const newArticlePage = fs.readFileSync(
	new URL("../app/admin/(protected)/articles/new/page.tsx", import.meta.url),
	"utf8",
);
const editArticlePage = fs.readFileSync(
	new URL("../app/admin/(protected)/articles/[id]/page.tsx", import.meta.url),
	"utf8",
);

test("article form lets admins pick an existing category or type a new one", () => {
	assert.match(articleForm, /categoryOptions\?: string\[\]/);
	assert.match(articleForm, /<datalist id="article-category-options">/);
	assert.match(articleForm, /list="article-category-options"/);
	assert.match(articleForm, /categoryOptions\.map/);
});

test("new and edit article pages pass existing categories to the form", () => {
	assert.match(newArticlePage, /getAdminCategoryOptions/);
	assert.match(newArticlePage, /categoryOptions=\{categoryOptions\}/);
	assert.match(editArticlePage, /getAdminCategoryOptions/);
	assert.match(editArticlePage, /categoryOptions=\{categoryOptions\}/);
});

test("article form keeps slug and author automatic instead of showing inputs", () => {
	assert.doesNotMatch(articleForm, />\s*URL slug\s*</);
	assert.doesNotMatch(articleForm, />\s*Author\s*</);
	assert.match(articleForm, /type="hidden" name="slug"/);
	assert.match(articleForm, /type="hidden" name="author"/);
	assert.match(articleForm, /slugifyArticleTitle\(value\)/);
	assert.match(articleForm, /Robin Seun/);
});
