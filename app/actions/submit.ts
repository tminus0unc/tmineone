"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";

export async function submitForm(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    const linkedinField = formData.get("linkedin");
    const linkedin = typeof linkedinField === "string" ? linkedinField.trim() : null;
    const isUncStudent = formData.get("isUncStudent") === "on";

    if (!firstName || !lastName || !email) {
        return { error: "All fields are required." };
    }
    if (linkedinField !== null && !linkedin) {
        return { error: "All fields are required." };
    }

    const supabase = createSupabaseAdminClient();

    const record: {
        source: string;
        first_name: string;
        last_name: string;
        email: string;
        linkedin?: string;
        is_unc_student?: boolean;
    } = {
        source: "introduce",
        first_name: firstName,
        last_name: lastName,
        email,
    };
    if (linkedin) record.linkedin = linkedin;
    if (linkedinField !== null) record.is_unc_student = isUncStudent;

    const { error } = await supabase
        .from("participants")
        .insert(record)
        .select();

    if (error) return { error: "Failed to save. Please try again." };

    return { success: true };
}