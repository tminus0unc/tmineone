"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function submitInvite(formData: FormData) {
  const response = formData.get("response") as string;
  const referralId = (formData.get("referralId") as string)?.trim() || null;

  if (response !== "accept" && response !== "decline") {
    return { error: "Please accept or decline the invite." };
  }

  const referrals = [1, 2, 3]
    .map((n) => ({
      first_name: (formData.get(`referral${n}First`) as string)?.trim(),
      last_name: (formData.get(`referral${n}Last`) as string)?.trim(),
    }))
    .filter((r) => r.first_name && r.last_name);

  const supabase = await createSupabaseClient();

  const { error: waitlistError } = await supabase
    .from("waitlist")
    .insert({ source: "invite", response, referral_id: referralId });

  if (waitlistError) return { error: "Failed to save. Please try again." };

  if (referrals.length > 0) {
    const { error: referralsError } = await supabase.from("referrals").insert(referrals);
    if (referralsError) return { error: "Failed to save your recommendations. Please try again." };
  }

  return { success: true };
}
