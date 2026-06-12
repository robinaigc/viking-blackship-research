import "server-only";

import { redirect } from "next/navigation";
import { getAdminEmail, getSupabaseConfig } from "../supabase/config";
import { createSupabaseServerClient, createSupabaseServiceClient } from "../supabase/server";

export type AdminSession = {
  id: string;
  email: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const adminEmail = getAdminEmail();
  const supabase = await createSupabaseServerClient();
  if (!adminEmail || !supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (error || !data.user || email !== adminEmail) return null;
  return { id: data.user.id, email };
}

export async function requireAdmin() {
  if (!getSupabaseConfig() || !getAdminEmail()) redirect("/admin/login?error=not-configured");
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function registerAdminUser(userId: string, email: string) {
  const adminEmail = getAdminEmail();
  if (!adminEmail || email.toLowerCase() !== adminEmail) return false;

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) return false;
  const { error } = await serviceClient.from("site_admins").upsert({ user_id: userId });
  if (error) throw new Error(`Unable to register administrator: ${error.message}`);
  return true;
}

