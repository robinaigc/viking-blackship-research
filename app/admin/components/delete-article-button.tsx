"use client";

import { LocalizedText, useLanguage } from "../../components/language";

export function DeleteArticleButton({ title }: { title: string }) {
	const { language } = useLanguage();
	const message =
		language === "zh"
			? `\u786e\u5b9a\u8981\u5220\u9664\u300a${title}\u300b\u5417\uff1f\u6b64\u64cd\u4f5c\u4e0d\u53ef\u64a4\u9500\u3002`
			: `Delete "${title}" permanently? This cannot be undone.`;

	return (
		<button
			type="submit"
			onClick={(event) => {
				if (!window.confirm(message)) event.preventDefault();
			}}
			className="rounded-lg border border-red-950 px-3 py-2 text-xs text-red-400 hover:border-red-700 hover:text-red-300"
		>
			<LocalizedText en="Delete" zh={"\u5220\u9664"} />
		</button>
	);
}
