"use client";

import { useEffect } from "react";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { buildTeamColorMap, colorForTeam } from "@/lib/teamColors";
import { formatCurrency } from "@/lib/format";
import { useNow } from "@/lib/useNow";

function timeAgo(iso: string, now: number): string {
  const diff = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function TransactionsPage() {
  const { entries, loading, error, lastUpdated } = useMoneyTrackerData();
  const { teams } = useTeams();
  const now = useNow();

  useEffect(() => {
    document.title = "Live Transactions — T-0";
  }, []);

  const colorMap = buildTeamColorMap(teams.map((t) => t.name));
  const feed = [...entries].reverse();

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 md:px-12 md:py-14">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-[10px] md:text-[11px] text-white/50 tracking-[0.4em] uppercase mb-1">
          FILE: TRANSACTIONS
        </p>
        <h1 className="font-timer font-light text-2xl md:text-3xl mb-6" style={{ color: "#f0f4f8" }}>
          Live raises.
        </h1>

        <div className="flex items-center gap-2 mb-8">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${error ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
          <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">
            {error
              ? error
              : lastUpdated
                ? `Live · updated ${Math.max(0, Math.round((now - lastUpdated) / 1000))}s ago`
                : "Connecting…"}
          </span>
        </div>

        <div className="space-y-3">
          {feed.map((entry) => (
            <div key={entry.id} className="flex gap-4 border border-white/10 p-4">
              {entry.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.image_url} alt="" className="w-16 h-16 object-cover flex-shrink-0 border border-white/10" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-white/70 truncate">
                    <span className="inline-block w-2 h-2 flex-shrink-0" style={{ backgroundColor: colorForTeam(colorMap, entry.team) }} />
                    {entry.team}
                  </span>
                  <span className="font-mono text-[9px] text-white/30 tracking-[0.15em] uppercase flex-shrink-0">
                    {timeAgo(entry.created_at, now)}
                  </span>
                </div>
                <p className="font-timer font-light text-xl tabular-nums" style={{ color: "#f0f4f8" }}>
                  {formatCurrency(entry.amount)}
                </p>
                {entry.method && <p className="font-timer font-light text-sm text-white/50 mt-1">{entry.method}</p>}
              </div>
            </div>
          ))}
          {!loading && feed.length === 0 && (
            <p className="font-timer font-light text-sm text-white/40 py-8 text-center">No raises logged yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
