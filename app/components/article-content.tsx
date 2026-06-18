"use client";

import React from "react";
import type {
	ArticleDocument,
	ArticleDocumentNode,
} from "../lib/articles/types";
import { useLanguage } from "./language";

function safeHref(value: unknown) {
	if (typeof value !== "string") return undefined;
	return /^(https?:|mailto:)/i.test(value) ? value : undefined;
}

function renderMarkedText(
	node: ArticleDocumentNode,
	key: React.Key,
): React.ReactNode {
	let content: React.ReactNode = node.text ?? "";
	for (const mark of node.marks ?? []) {
		if (mark.type === "bold") content = <strong>{content}</strong>;
		if (mark.type === "italic") content = <em>{content}</em>;
		if (mark.type === "strike") content = <s>{content}</s>;
		if (mark.type === "code") content = <code>{content}</code>;
		if (mark.type === "link") {
			const href = safeHref(mark.attrs?.href);
			if (href)
				content = (
					<a
						href={href}
						rel="noreferrer"
						target={href.startsWith("http") ? "_blank" : undefined}
					>
						{content}
					</a>
				);
		}
	}
	return <React.Fragment key={key}>{content}</React.Fragment>;
}

function renderNode(
	node: ArticleDocumentNode,
	key: React.Key,
): React.ReactNode {
	const children = node.content?.map((child, index) =>
		renderNode(child, `${key}-${index}`),
	);
	if (node.type === "text") return renderMarkedText(node, key);
	if (node.type === "paragraph") return <p key={key}>{children}</p>;
	if (node.type === "heading") {
		const level = Number(node.attrs?.level ?? 2);
		if (level === 1) return <h1 key={key}>{children}</h1>;
		if (level === 3) return <h3 key={key}>{children}</h3>;
		return <h2 key={key}>{children}</h2>;
	}
	if (node.type === "bulletList") return <ul key={key}>{children}</ul>;
	if (node.type === "orderedList") return <ol key={key}>{children}</ol>;
	if (node.type === "listItem") return <li key={key}>{children}</li>;
	if (node.type === "blockquote")
		return <blockquote key={key}>{children}</blockquote>;
	if (node.type === "hardBreak") return <br key={key} />;
	if (node.type === "horizontalRule") return <hr key={key} />;
	if (node.type === "image") {
		const src = safeHref(node.attrs?.src);
		if (!src) return null;
		const rawWidth = String(node.attrs?.width ?? "100%");
		const imageWidth = /^(50|70|100)%$/.test(rawWidth) ? rawWidth : "100%";
		return (
			<figure key={key} style={{ width: imageWidth, marginRight: "auto" }}>
				<img
					src={src}
					alt={String(node.attrs?.alt ?? "Article image")}
					loading="lazy"
				/>
			</figure>
		);
	}
	if (node.type === "table")
		return (
			<div key={key} className="table-scroll">
				<table>
					<tbody>{children}</tbody>
				</table>
			</div>
		);
	if (node.type === "tableRow") return <tr key={key}>{children}</tr>;
	if (node.type === "tableHeader") return <th key={key}>{children}</th>;
	if (node.type === "tableCell") return <td key={key}>{children}</td>;
	if (node.type === "doc")
		return <React.Fragment key={key}>{children}</React.Fragment>;
	return null;
}

export function ArticleContent({
	content,
	localizedContent,
}: { content: ArticleDocument; localizedContent?: ArticleDocument }) {
	const { language } = useLanguage();
	const document =
		language === "zh" && localizedContent ? localizedContent : content;
	return (
		<div className="article-content">{renderNode(document, "article")}</div>
	);
}
