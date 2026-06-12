"use client";

import { useState } from "react";
import type { ArticleDocument, ArticleRecord } from "../../lib/articles/types";
import { slugifyArticleTitle } from "../../lib/articles/validation";
import { RichTextEditor } from "./rich-text-editor";

type Props = {
  article?: ArticleRecord;
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  saved?: boolean;
};

const emptyDocument: ArticleDocument = { type: "doc", content: [{ type: "paragraph" }] };
const fieldClass =
  "mt-2 min-h-11 w-full rounded-lg border border-zinc-700 bg-black/40 px-4 text-sm text-zinc-100 outline-none focus:border-zinc-300";

export function ArticleForm({ article, action, error, saved }: Props) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(article));
  const [content, setContent] = useState<ArticleDocument>(article?.content ?? emptyDocument);

  return (
    <form action={action} className="space-y-8">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      {article ? <input type="hidden" name="previousSlug" value={article.slug} /> : null}
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      {saved ? <p className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-300">Article saved.</p> : null}
      {error ? <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="text-sm text-zinc-300">
          Title
          <input
            className={fieldClass}
            name="title"
            required
            maxLength={180}
            value={title}
            onChange={(event) => {
              const value = event.target.value;
              setTitle(value);
              if (!slugEdited) setSlug(slugifyArticleTitle(value));
            }}
          />
        </label>
        <label className="text-sm text-zinc-300">
          URL slug
          <input
            className={fieldClass}
            name="slug"
            required
            maxLength={120}
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(slugifyArticleTitle(event.target.value));
            }}
          />
        </label>
        <label className="text-sm text-zinc-300">
          Author
          <input className={fieldClass} name="author" required maxLength={120} defaultValue={article?.author ?? "Robin Seun"} />
        </label>
        <label className="text-sm text-zinc-300">
          Category
          <input className={fieldClass} name="category" maxLength={100} defaultValue={article?.category ?? "Analysis"} />
        </label>
      </div>

      <label className="block text-sm text-zinc-300">
        Summary
        <textarea className={`${fieldClass} min-h-28 py-3`} name="summary" required maxLength={500} defaultValue={article?.summary} />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="text-sm text-zinc-300">
          Tags, separated by commas
          <input className={fieldClass} name="tags" defaultValue={article?.tags.join(", ")} />
        </label>
        <label className="text-sm text-zinc-300">
          Cover image URL
          <input className={fieldClass} name="coverImageUrl" type="url" defaultValue={article?.coverImageUrl ?? ""} />
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm text-zinc-300">Article content</p>
        <RichTextEditor initialContent={content} onChange={setContent} />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-6">
        <select name="status" defaultValue={article?.status ?? "draft"} className="min-h-11 rounded-lg border border-zinc-700 bg-black px-4 text-sm text-zinc-100">
          <option value="draft">Save as draft</option>
          <option value="published">Publish</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="featured" defaultChecked={article?.featured} /> Featured article
        </label>
        <button type="submit" className="ml-auto min-h-11 rounded-lg border border-zinc-500 px-6 text-sm text-white hover:border-white">
          {article ? "Save changes" : "Create article"}
        </button>
      </div>
    </form>
  );
}

