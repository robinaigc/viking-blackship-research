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
	assert.match(adminLayout, /zh="新建文章"/);
	assert.match(adminLayout, /zh="退出登录"/);
	assert.match(adminHome, /LocalizedText/);
	assert.match(adminHome, /zh="文章"/);
	assert.match(adminHome, /zh="新建文章"/);
});
