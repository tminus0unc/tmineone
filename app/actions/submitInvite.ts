"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";

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

  const supabase = createSupabaseAdminClient();

  let referredBy: { first_name: string; last_name: string } | null = null;

  if (referralId) {
    const { data: referral } = await supabase
      .from("referrals")
      .select("first_name, last_name, status")
      .eq("id", referralId)
      .maybeSingle();

    if (!referral) return { error: "This invite link is no longer valid." };
    if (referral.status === "accepted" || referral.status === "declined") {
      return { error: "You've already responded to this invite." };
    }

    referredBy = referral;

    const { data: updated, error: statusError } = await supabase
      .from("referrals")
      .update({ status: response === "accept" ? "accepted" : "declined", contacted: true })
      .eq("id", referralId)
      .select("id")
      .maybeSingle();

    if (statusError) return { error: "Failed to save. Please try again." };
    if (!updated) {
      console.error(
        `submitInvite: update to referrals.id=${referralId} matched 0 rows — check that an UPDATE RLS policy exists for the anon role on the referrals table`
      );
      return { error: "Failed to save. Please try again." };
    }
  }

  if (response === "accept") {
    const { error: participantsError } = await supabase.from("participants").insert({
      source: "invite",
      referral_id: referralId,
      first_name: referredBy?.first_name ?? null,
      last_name: referredBy?.last_name ?? null,
      is_unc_student: true,
    });

    if (participantsError) return { error: "Failed to save. Please try again." };
  }

  if (referredFriends.length > 0) {
    const { error: referralsError } = await supabase.from("referrals").insert(referredFriends);
    if (referralsError) return { error: "Failed to save your recommendations. Please try again." };
  }

  return { success: true };
}
