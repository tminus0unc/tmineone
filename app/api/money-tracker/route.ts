import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

// Resolves a submission's team, self-registering a new team the first time
// a given formId is ever seen. formId comes from Apps Script's own
// FormApp.getId() — nobody types it, so it can't be mistyped, unlike
// matching on the form's title text (kept only as a last-resort fallback).
async function resolveTeamName(
  supabase: SupabaseClient,
  formId: string | undefined,
  fallbackTeam: string | undefined
): Promise<string | null> {
  if (!formId) return fallbackTeam || null;

  const { data: existing } = await supabase.from("teams").select("name").eq("form_id", formId).maybeSingle();
  if (existing?.name) return existing.name;

  if (!fallbackTeam) return null;

  // Claim a team that was pre-added via the portal (name set, no form
  // linked yet) before falling back to creating a brand new one.
  const { data: linked } = await supabase
    .from("teams")
    .update({ form_id: formId })
    .ilike("name", fallbackTeam.trim())
    .is("form_id", null)
    .select("name")
    .maybeSingle();
  if (linked?.name) return linked.name;

  const { data: inserted } = await supabase
    .from("teams")
    .insert({ name: fallbackTeam, form_id: formId })
    .select("name")
    .maybeSingle();

  // Name collision (e.g. a forgotten rename on the form) — still record the
  // raw submission under its title-derived name rather than dropping it.
  return inserted?.name ?? fallbackTeam;
}

// Called by the Apps Script trigger attached to each team's Google Form —
// see scripts/moneyTrackerFormTrigger.gs. Unique on (team, response_id) so a
// retried webhook delivery never double-counts a raise.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (!process.env.MONEY_TRACKER_WEBHOOK_SECRET || secret !== process.env.MONEY_TRACKER_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { team, formId, amount, method, imageUrl, responseId } = body as {
    team?: string;
    formId?: string;
    amount?: number;
    method?: string;
    imageUrl?: string;
    responseId?: string;
  };

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "a numeric amount is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const resolvedTeam = await resolveTeamName(supabase, formId, team);

  if (!resolvedTeam) {
    return NextResponse.json({ error: "could not resolve a team from formId or team" }, { status: 400 });
  }

  const { error } = await supabase.from("money_tracker_entries").insert({
    team: resolvedTeam,
    amount,
    method: method || null,
    image_url: imageUrl || null,
    response_id: responseId || null,
  });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
