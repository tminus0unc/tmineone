import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

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

  const { team, amount, method, imageUrl, responseId } = body as {
    team?: string;
    amount?: number;
    method?: string;
    imageUrl?: string;
    responseId?: string;
  };

  if (!team || typeof amount !== "number" || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "team and a numeric amount are required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("money_tracker_entries").insert({
    team,
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
