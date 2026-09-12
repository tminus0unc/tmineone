"use client";

import { useEffect, useRef, useState } from "react";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { computeTotals, computeSeries } from "@/lib/moneyTrackerMath";
import { buildTeamColorMap } from "@/lib/teamColors";
import { formatCurrency } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import RaisedOverTimeChart from "@/components/moneytracker/RaisedOverTimeChart";

const FLASH_DURATION_MS = 2000;

export default function LeaderboardPage() {
  const { entries, loading, error, lastUpdated } = useMoneyTrackerData();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const now = useNow();
  const prevTotals = useRef<Map<string, number> | null>(null);
  const [flashTeams, setFlashTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Leaderboard — T-0";
  }, []);

  const colorMap = buildTeamColorMap(teams.map((t) => t.name));
  const activeTeamNames = teams.filter((t) => t.active).map((t) => t.name);
  const totals = computeTotals(entries, activeTeamNames, colorMap);
  const series = computeSeries(entries, activeTeamNames, colorMap);
  const isLoading = loading || teamsLoading;
  const combinedError = error || teamsError;
  const grandTotal = totals.reduce((sum, t) => sum + t.total, 0);
  const leader = totals[0]?.total ?? 0;

  // Flash a row when its total actually changes so a new raise visibly
  // announces itself instead of the number silently updating — but not on
  // the very first load.
  useEffect(() => {
    if (isLoading) return;
    const current = new Map(totals.map((t) => [t.team, t.total]));
    if (prevTotals.current === null) {
      prevTotals.current = current;
      return;
    }
    const changed: string[] = [];
    current.forEach((total, team) => {
      if (prevTotals.current!.get(team) !== total) changed.push(team);
    });
    prevTotals.current = current;
    if (changed.length === 0) return;

    const showTimeout = setTimeout(() => {
      setFlashTeams((prev) => new Set([...prev, ...changed]));
    }, 0);
    const hideTimeout = setTimeout(() => {
      setFlashTeams((prev) => {
        const next = new Set(prev);
        changed.forEach((team) => next.delete(team));
        return next;
      });
    }, FLASH_DURATION_MS);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [totals, isLoading]);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 md:px-12 md:py-14">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <p className="font-mono text-[10px] md:text-[11px] text-white/50 tracking-[0.4em] uppercase mb-1">
              FILE: LEADERBOARD{!isLoading && ` · ${totals.length} TEAMS`}
            </p>
            <h1 className="font-timer font-light text-2xl md:text-3xl" style={{ color: "#f0f4f8" }}>
              Who&apos;s raising the most.
            </h1>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[0.25em] uppercase">Total raised</p>
            <p className="font-timer font-light text-xl md:text-2xl tabular-nums" style={{ color: "#f0f4f8" }}>
              {formatCurrency(grandTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${combinedError ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
          <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">
            {combinedError
              ? combinedError
              : lastUpdated
                ? `Live · updated ${Math.max(0, Math.round((now - lastUpdated) / 1000))}s ago`
                : "Connecting…"}
          </span>
        </div>

        <div className="border-t border-white/10 mb-12">
          {totals.map((t, i) => (
            <div
              key={t.team}
              className={`flex items-center gap-3 md:gap-4 py-4 border-b border-white/10 ${
                flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
              }`}
            >
              <span className="font-timer font-light text-lg md:text-xl text-white/30 w-7 md:w-8 flex-shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="inline-block w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span className="flex-1 min-w-0 font-mono text-xs md:text-base tracking-[0.05em] uppercase text-white/80 truncate">
                {t.team}
              </span>
              <div className="hidden md:block flex-1 max-w-[200px] h-1 bg-white/10 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 transition-[width] duration-700"
                  style={{ width: `${leader > 0 ? (t.total / leader) * 100 : 0}%`, backgroundColor: t.color }}
                />
              </div>
              <span className="font-timer font-light text-lg md:text-2xl tabular-nums flex-shrink-0" style={{ color: "#f0f4f8" }}>
                {formatCurrency(t.total)}
              </span>
            </div>
          ))}
          {!isLoading && totals.length === 0 && (
            <p className="font-timer font-light text-sm text-white/40 py-8 text-center">
              {teams.length === 0 ? "No teams registered yet." : "No raises logged yet."}
            </p>
          )}
        </div>

        <div>
          <p className="font-mono text-[10px] md:text-[11px] text-white/50 tracking-[0.4em] uppercase mb-1">
            FILE: RAISED OVER TIME
          </p>
          <h2 className="font-timer font-light text-xl md:text-2xl mb-6" style={{ color: "#f0f4f8" }}>
            Money raised, live.
          </h2>

          {isLoading ? (
            <p className="font-timer font-light text-sm text-white/40 py-16 text-center">Loading…</p>
          ) : activeTeamNames.length === 0 ? (
            <p className="font-timer font-light text-sm text-white/40 py-16 text-center">No teams registered yet.</p>
          ) : entries.length === 0 ? (
            <p className="font-timer font-light text-sm text-white/40 py-16 text-center">
              No raises logged yet — the chart fills in as teams submit.
            </p>
          ) : (
            <RaisedOverTimeChart series={series} />
          )}
        </div>
      </div>
    </main>
  );
}
