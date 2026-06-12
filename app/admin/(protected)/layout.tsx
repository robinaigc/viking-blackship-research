import Link from "next/link";
import { LanguageToggle, LocalizedText } from "../../components/language";
import { requireAdmin } from "../../lib/auth/admin";
import { signOutAdmin } from "../actions";

export default async function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	const admin = await requireAdmin();
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			<header className="border-b border-zinc-800 bg-black/80">
				<div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-4">
					<Link href="/admin" className="font-display text-lg">
						Viking Blackship Admin
					</Link>
					<Link
						href="/admin/articles/new"
						className="text-sm text-zinc-400 hover:text-white"
					>
						<LocalizedText en="New article" zh="新建文章" />
					</Link>
					<Link href="/" className="text-sm text-zinc-400 hover:text-white">
						<LocalizedText en="View website" zh="查看网站" />
					</Link>
					<LanguageToggle className="ml-auto text-sm text-zinc-400 duration-200 hover:text-white" />
					<span className="hidden text-xs text-zinc-600 sm:block">
						{admin.email}
					</span>
					<form action={signOutAdmin}>
						<button
							type="submit"
							className="text-sm text-zinc-400 hover:text-white"
						>
							<LocalizedText en="Sign out" zh="退出登录" />
						</button>
					</form>
				</div>
			</header>
			{children}
		</div>
	);
}
