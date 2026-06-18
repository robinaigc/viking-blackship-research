import "server-only";

import { requireAdmin } from "../../lib/auth/admin";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function getAdminCategoryOptions() {
	const admin = await requireAdmin();
	const supabase = await createSupabaseServerClient();
	if (!supabase) return ["Analysis"];

	const { data, error } = await supabase
		.from("articles")
		.select("category")
		.eq("owner_id", admin.id)
		.order("category", { ascending: true });

	if (error) return ["Analysis"];

	const categories = (data ?? [])
		.map((row) => String(row.category ?? "").trim())
		.filter(Boolean);

	return [...new Set(["Analysis", ...categories])];
}
