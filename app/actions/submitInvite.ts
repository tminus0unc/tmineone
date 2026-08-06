"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function submitInvite(formData: FormData) {
  const response = formData.get("response") as string;
  const referralId = (formData.get("referralId") as string)?.trim() || null;

  if (response !== "accept" && response !== "decline") {
    return { error: "Please accept or decline the invite." };
  }

  const referredFriends = [1, 2, 3]
    .map((n) => ({
      first_name: (formData.get(`referral${n}First`) as string)?.trim(),
      last_name: (formData.get(`referral${n}Last`) as string)?.trim(),
    }))
    .filter((r) => r.first_name && r.last_name);

  const supabase = await createSupabaseClient();

  if (referralId) {
    const { error: statusError } = await supabase
      .from("referrals")
      .update({ status: response === "accept" ? "accepted" : "declined" })
      .eq("id", referralId);

    if (statusError) return { error: "Failed to save. Please try again." };
  }

  if (response === "accept") {
    const { error: participantsError } = await supabase
      .from("participants")
      .insert({ source: "invite", referral_id: referralId });

    if (participantsError) return { error: "Failed to save. Please try again." };
  }

  if (referredFriends.length > 0) {
    const { error: referralsError } = await supabase.from("referrals").insert(referredFriends);
    if (referralsError) return { error: "Failed to save your recommendations. Please try again." };
  }

  return { success: true };
}
