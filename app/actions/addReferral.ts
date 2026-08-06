"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function addReferral(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();

  if (!firstName || !lastName) {
    return { error: "First and last name are required." };
  }

  const supabase = await createSupabaseClient();

  const { error } = await supabase
    .from("referrals")
    .insert({ first_name: firstName, last_name: lastName });

  if (error) return { error: "Failed to save. Please try again." };

  return { success: true };
}
