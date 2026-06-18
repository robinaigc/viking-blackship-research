"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import {
	EditorContent,
	NodeViewWrapper,
	ReactNodeViewRenderer,
	useEditor,
	type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	useRef,
	useState,
	type PointerEvent as ReactPointerEvent,
} from "react";
import type { ArticleDocument } from "../../lib/articles/types";

type Props = {
	initialContent: ArticleDocument;
	onChange: (content: ArticleDocument) => void;
};

const buttonClass =
	"rounded border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-400 hover:text-white disabled:opacity-40";
const DEFAULT_IMAGE_WIDTH = "70%";
const resizeHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type ResizeHandle = typeof resizeHandles[number];

function clampImageWidth(value: number) {
	return Math.max(25, Math.min(100, Math.round(value)));
}

function getImageWidth(value: unknown) {
	return typeof value === "string" && /^(?:[2-9]\d|100)%$/.test(value)
		? value
		: DEFAULT_IMAGE_WIDTH;
}

function ResizableImageView({
	node,
	selected,
	updateAttributes,
}: NodeViewProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const width = getImageWidth(node.attrs.width);

	function startResize(
		event: ReactPointerEvent<HTMLButtonElement>,
		handle: ResizeHandle,
	) {
		event.preventDefault();
		event.stopPropagation();

		const wrapper = wrapperRef.current;
		const parent = wrapper?.parentElement;
		if (!wrapper || !parent) return;

		const startX = event.clientX;
		const startY = event.clientY;
		const rect = wrapper.getBoundingClientRect();
		const parentWidth = parent.getBoundingClientRect().width || rect.width;
		const aspectRatio = rect.width / (rect.height || rect.width || 1);

		function horizontalDelta(pointerEvent: PointerEvent) {
			if (handle.includes("e")) return pointerEvent.clientX - startX;
			if (handle.includes("w")) return startX - pointerEvent.clientX;
			return 0;
		}

		function verticalDelta(pointerEvent: PointerEvent) {
			if (handle.includes("s"))
				return (pointerEvent.clientY - startY) * aspectRatio;
			if (handle.includes("n"))
				return (startY - pointerEvent.clientY) * aspectRatio;
			return 0;
		}

		function onPointerMove(pointerEvent: PointerEvent) {
			const xDelta = horizontalDelta(pointerEvent);
			const yDelta = verticalDelta(pointerEvent);
			const delta = Math.abs(xDelta) >= Math.abs(yDelta) ? xDelta : yDelta;
			const nextWidth = clampImageWidth(
				((rect.width + delta) / parentWidth) * 100,
			);
			updateAttributes({ width: `${nextWidth}%` });
		}

		function onPointerUp() {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
		}

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
	}

	return (
		<NodeViewWrapper
			as="figure"
			ref={wrapperRef}
			className={`relative mr-auto my-6 max-w-full ${
				selected ? "ring-2 ring-sky-400" : ""
			}`}
			contentEditable={false}
			style={{ width }}
		>
			<img
				src={node.attrs.src}
				alt={String(node.attrs.alt ?? "Article image")}
				className="block h-auto w-full"
				draggable={false}
			/>
			{selected
				? resizeHandles.map((handle) => (
						<button
							key={handle}
							type="button"
							data-image-resize-handle={handle}
							aria-label={`Resize image ${handle}`}
							className={`absolute h-3 w-3 rounded-full border border-sky-200 bg-sky-500 ${
								handle.includes("n")
									? "-top-1.5"
									: handle.includes("s")
									? "-bottom-1.5"
									: "top-1/2 -translate-y-1/2"
							} ${
								handle.includes("w")
									? "-left-1.5"
									: handle.includes("e")
									? "-right-1.5"
									: "left-1/2 -translate-x-1/2"
							}`}
							onPointerDown={(event) => startResize(event, handle)}
						/>
				  ))
				: null}
		</NodeViewWrapper>
	);
}

const ResizableImage = Image.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			width: {
				default: DEFAULT_IMAGE_WIDTH,
				parseHTML: (element) =>
					element.getAttribute("width") ?? DEFAULT_IMAGE_WIDTH,
				renderHTML: (attributes) => ({
					width: attributes.width,
					style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
				}),
			},
		};
	},
	addNodeView() {
		return ReactNodeViewRenderer(ResizableImageView);
	},
});

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
			ResizableImage.configure({ allowBase64: false }),
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
				.setImage({
					src: result.url,
					alt: file.name,
				})
				.updateAttributes("image", { width: DEFAULT_IMAGE_WIDTH })
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
