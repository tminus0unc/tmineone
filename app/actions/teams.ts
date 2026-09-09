"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";

export type Team = {
  id: string;
  name: string;
  spreadsheet_url: string | null;
  active: boolean;
  created_at: string;
};

export async function getTeams(): Promise<{ teams?: Team[]; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("teams")
    .select("id, name, spreadsheet_url, active, created_at")
    .order("created_at", { ascending: true });

  if (error) return { error: "Failed to load teams." };

  return { teams: data ?? [] };
}

export async function addTeam(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const spreadsheetUrl = (formData.get("spreadsheetUrl") as string)?.trim();

  if (!name) return { error: "Team name is required." };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("teams").insert({
    name,
    spreadsheet_url: spreadsheetUrl || null,
  });

  if (error) {
    return { error: error.code === "23505" ? "A team with that name already exists." : "Failed to add team." };
  }

  return { success: true };
}

export async function updateTeam(
  id: string,
  updates: Partial<Pick<Team, "name" | "spreadsheet_url" | "active">>
) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("teams").update(updates).eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "A team with that name already exists." : "Failed to update team." };
  }

  return { success: true };
}

export async function deleteTeam(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("teams").delete().eq("id", id);

  if (error) return { error: "Failed to delete team." };

  return { success: true };
}
