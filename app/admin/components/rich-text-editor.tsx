"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import type { ArticleDocument } from "../../lib/articles/types";

type Props = {
	initialContent: ArticleDocument;
	onChange: (content: ArticleDocument) => void;
};

const buttonClass =
	"rounded border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-400 hover:text-white disabled:opacity-40";

function getClipboardImageFile(event: ClipboardEvent) {
	const file = Array.from(event.clipboardData?.files ?? []).find((candidate) =>
		candidate.type.startsWith("image/"),
	);
	if (file) return file;

	const item = Array.from(event.clipboardData?.items ?? []).find(
		(candidate) =>
			candidate.kind === "file" && candidate.type.startsWith("image/"),
	);
	return item?.getAsFile() ?? null;
}

export function RichTextEditor({ initialContent, onChange }: Props) {
	const fileInput = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				protocols: ["http", "https", "mailto"],
			}),
			Image.configure({ allowBase64: false }),
			TableKit.configure({ table: { resizable: true } }),
		],
		content: initialContent,
		editorProps: {
			attributes: {
				class:
					"min-h-[420px] rounded-b-lg border-x border-b border-zinc-700 bg-black/40 p-5 text-sm leading-8 text-zinc-200 outline-none prose prose-invert max-w-none",
			},
			handlePaste: (_view, event) => {
				const file = getClipboardImageFile(event);
				if (!file) return false;
				event.preventDefault();
				void uploadImage(file);
				return true;
			},
		},
		onUpdate: ({ editor: currentEditor }) =>
			onChange(currentEditor.getJSON() as ArticleDocument),
	});

	async function uploadImage(file: File) {
		setUploading(true);
		const body = new FormData();
		body.set("file", file);
		try {
			const response = await fetch("/api/admin/images", {
				method: "POST",
				body,
			});
			const result = (await response.json()) as {
				url?: string;
				error?: string;
			};
			if (!response.ok || !result.url)
				throw new Error(result.error ?? "Upload failed.");
			editor
				?.chain()
				.focus()
				.setImage({ src: result.url, alt: file.name })
				.run();
		} catch (error) {
			window.alert(
				error instanceof Error ? error.message : "Image upload failed.",
			);
		} finally {
			setUploading(false);
			if (fileInput.current) fileInput.current.value = "";
		}
	}

	if (!editor)
		return (
			<div className="min-h-[460px] rounded-lg border border-zinc-800 bg-black/30" />
		);

	return (
		<div>
			<div className="flex flex-wrap gap-2 rounded-t-lg border border-zinc-700 bg-zinc-900 p-3">
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().toggleBold().run()}
				>
					Bold
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().toggleItalic().run()}
				>
					Italic
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					H1
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					H2
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				>
					H3
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
				>
					Bullets
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
				>
					Numbers
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
				>
					Quote
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => {
						const href = window.prompt("Link URL", "https://");
						if (href)
							editor
								.chain()
								.focus()
								.extendMarkRange("link")
								.setLink({ href })
								.run();
					}}
				>
					Link
				</button>
				<button
					type="button"
					className={buttonClass}
					disabled={uploading}
					onClick={() => fileInput.current?.click()}
				>
					{uploading ? "Uploading..." : "Image"}
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() =>
						editor
							.chain()
							.focus()
							.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
							.run()
					}
				>
					Table
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().addRowAfter().run()}
				>
					+ Row
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().addColumnAfter().run()}
				>
					+ Column
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().deleteTable().run()}
				>
					Delete table
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().undo().run()}
				>
					Undo
				</button>
				<button
					type="button"
					className={buttonClass}
					onClick={() => editor.chain().focus().redo().run()}
				>
					Redo
				</button>
				<input
					ref={fileInput}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					className="hidden"
					onChange={(event) => {
						const file = event.target.files?.[0];
						if (file) void uploadImage(file);
					}}
				/>
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}
