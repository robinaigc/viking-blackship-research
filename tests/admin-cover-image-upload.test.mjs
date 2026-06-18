import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const articleForm = fs.readFileSync(
	new URL("../app/admin/components/article-form.tsx", import.meta.url),
	"utf8",
);
const coverUploader = fs.readFileSync(
	new URL("../app/admin/components/cover-image-uploader.tsx", import.meta.url),
	"utf8",
);

test("article form uses the cover image uploader instead of a visible URL field", () => {
	assert.match(articleForm, /CoverImageUploader/);
	assert.match(coverUploader, /name="coverImageUrl"/);
	assert.doesNotMatch(articleForm, /type="url"/);
});

test("cover image uploader posts local files to the admin image API", () => {
	assert.match(coverUploader, /type="file"/);
	assert.match(coverUploader, /accept="image\/jpeg,image\/png,image\/webp"/);
	assert.match(coverUploader, /fetch\("\/api\/admin\/images"/);
	assert.match(coverUploader, /setCoverImageUrl\(result\.url\)/);
	assert.match(coverUploader, /aria-label="Upload cover image"/);
});
