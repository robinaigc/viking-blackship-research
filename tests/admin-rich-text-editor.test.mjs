import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const richTextEditor = fs.readFileSync(
	new URL("../app/admin/components/rich-text-editor.tsx", import.meta.url),
	"utf8",
);
const articleContent = fs.readFileSync(
	new URL("../app/components/article-content.tsx", import.meta.url),
	"utf8",
);

test("rich text editor exposes H1, H2, and H3 heading controls", () => {
	assert.match(richTextEditor, /toggleHeading\(\{ level: 1 \}\)/);
	assert.match(richTextEditor, />\s*H1\s*<\/button>/);
	assert.match(richTextEditor, /toggleHeading\(\{ level: 2 \}\)/);
	assert.match(richTextEditor, /toggleHeading\(\{ level: 3 \}\)/);
	assert.match(articleContent, /return <h1 key=\{key\}>\{children\}<\/h1>/);
});

test("rich text editor uploads pasted image files before inserting them", () => {
	assert.match(richTextEditor, /handlePaste/);
	assert.match(richTextEditor, /getClipboardImageFile/);
	assert.match(richTextEditor, /clipboardData\?\.files/);
	assert.match(richTextEditor, /clipboardData\?\.items/);
	assert.match(richTextEditor, /void uploadImage\(file\)/);
	assert.match(richTextEditor, /event\.preventDefault\(\)/);
});
