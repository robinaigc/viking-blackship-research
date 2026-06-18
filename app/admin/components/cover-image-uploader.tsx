"use client";

import { useRef, useState } from "react";

type Props = {
	initialUrl?: string | null;
};

export function CoverImageUploader({ initialUrl }: Props) {
	const fileInput = useRef<HTMLInputElement>(null);
	const [coverImageUrl, setCoverImageUrl] = useState(initialUrl ?? "");
	const [uploading, setUploading] = useState(false);

	async function uploadCoverImage(file: File) {
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
			if (!response.ok || !result.url) {
				throw new Error(result.error ?? "Cover image upload failed.");
			}
			setCoverImageUrl(result.url);
		} catch (error) {
			window.alert(
				error instanceof Error ? error.message : "Cover image upload failed.",
			);
		} finally {
			setUploading(false);
			if (fileInput.current) fileInput.current.value = "";
		}
	}

	return (
		<div className="mt-2">
			<input type="hidden" name="coverImageUrl" value={coverImageUrl} />
			<button
				type="button"
				aria-label="Upload cover image"
				onClick={() => fileInput.current?.click()}
				disabled={uploading}
				className="flex min-h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-700 bg-black/40 text-zinc-500 outline-none duration-200 hover:border-zinc-400 hover:text-zinc-200 disabled:opacity-50"
			>
				{coverImageUrl ? (
					<img
						src={coverImageUrl}
						alt=""
						className="h-full max-h-64 w-full object-cover"
					/>
				) : (
					<span className="text-4xl leading-none">
						{uploading ? "..." : "+"}
					</span>
				)}
			</button>
			<div className="mt-3 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={() => fileInput.current?.click()}
					disabled={uploading}
					className="text-xs text-zinc-400 hover:text-white disabled:opacity-50"
				>
					{uploading
						? "Uploading cover..."
						: coverImageUrl
						? "Change cover"
						: "Upload cover"}
				</button>
				{coverImageUrl ? (
					<button
						type="button"
						onClick={() => setCoverImageUrl("")}
						className="text-xs text-red-400 hover:text-red-300"
					>
						Remove cover
					</button>
				) : null}
			</div>
			<input
				ref={fileInput}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) void uploadCoverImage(file);
				}}
			/>
		</div>
	);
}
