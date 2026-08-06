import { createAdminClient } from "@supabase/server/core";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient(): SupabaseClient {
    return createAdminClient() as unknown as SupabaseClient;
}
