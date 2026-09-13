"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";

// countdown_state is a singleton table (always exactly one row, id = 1) so
// every viewer of /countdown reads the same start_time — started/reset from
// the team portal, not per-browser localStorage.

export async function getCountdownStartTime(): Promise<{ startTime?: string | null; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.from("countdown_state").select("start_time").eq("id", 1).maybeSingle();

  if (error) return { error: "Failed to load countdown state." };

  return { startTime: data?.start_time ?? null };
}

export async function startCountdown(): Promise<{ success?: boolean; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("countdown_state")
    .upsert({ id: 1, start_time: new Date().toISOString() });

  if (error) return { error: "Failed to start the countdown." };

  return { success: true };
}

export async function resetCountdown(): Promise<{ success?: boolean; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("countdown_state").upsert({ id: 1, start_time: null });

  if (error) return { error: "Failed to reset the countdown." };

  return { success: true };
}
