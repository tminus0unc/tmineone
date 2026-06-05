"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function submitForm(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    console.log("Form data:", { firstName, lastName, email });

    if (!firstName || !lastName || !email) {
        return { error: "All fields are required." };
    }

    const supabase = await createSupabaseClient();

    const { error, data } = await supabase
        .from("contact_submissions")
        .insert({ first_name: firstName, last_name: lastName, email })
        .select();

    if (error) return { error: "Failed to save. Please try again." };

    return { success: true };
}