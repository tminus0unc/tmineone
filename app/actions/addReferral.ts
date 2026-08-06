"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";

export type Referral = {
  id: string;
  first_name: string;
  last_name: string;
  status: string | null;
  contacted: boolean;
};

export async function getReferrals(): Promise<{ referrals?: Referral[]; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("referrals")
    .select("id, first_name, last_name, status, contacted")
    .order("created_at", { ascending: false });

  if (error) return { error: "Failed to load referrals." };

  return { referrals: data ?? [] };
}

export async function setReferralContacted(id: string, contacted: boolean) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("referrals").update({ contacted }).eq("id", id);

  if (error) return { error: "Failed to save. Please try again." };

  return { success: true };
}

export type ReferralAccess =
  | { valid: false }
  | { valid: true; status: string | null; alreadyResponded: boolean };

export async function getReferralAccess(id: string): Promise<ReferralAccess> {
  const supabase = createSupabaseAdminClient();

  const { data: referral } = await supabase
    .from("referrals")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (!referral) return { valid: false };

  if (referral.status === "accepted" || referral.status === "declined") {
    return { valid: true, status: referral.status, alreadyResponded: true };
  }

  const { data: participant } = await supabase
    .from("participants")
    .select("id")
    .eq("referral_id", id)
    .maybeSingle();

  return { valid: true, status: referral.status, alreadyResponded: !!participant };
}

export async function addReferral(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();

  if (!firstName || !lastName) {
    return { error: "First and last name are required." };
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("referrals")
    .insert({ first_name: firstName, last_name: lastName });

  if (error) return { error: "Failed to save. Please try again." };

  return { success: true };
}
