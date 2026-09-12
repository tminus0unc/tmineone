"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";

export type MoneyEntry = {
  id: string;
  team: string;
  amount: number;
  method: string | null;
  image_url: string | null;
  created_at: string;
};

export async function getMoneyEntries(): Promise<{ entries?: MoneyEntry[]; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("money_tracker_entries")
    .select("id, team, amount, method, image_url, created_at")
    .order("created_at", { ascending: true });

  if (error) return { error: "Failed to load entries." };

  return { entries: data ?? [] };
}

// Wipes every raise — for clearing out test data before the real event.
// Teams stay registered (their form_id link isn't touched), only the
// transaction history is cleared.
export async function resetMoneyTrackerFeed(): Promise<{ success?: boolean; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("money_tracker_entries")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) return { error: "Failed to reset the feed." };

  return { success: true };
}
