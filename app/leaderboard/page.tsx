"use client";

import { useEffect, useState } from "react";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { useNewEntries } from "@/lib/useNewEntries";
import { useCyclingIndex } from "@/lib/useCyclingIndex";
import { computeTotals, computeSeries, type TeamTotal } from "@/lib/moneyTrackerMath";
import { buildTeamColorMap } from "@/lib/teamColors";
import { formatCurrency } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import RaisedOverTimeChart from "@/components/moneytracker/RaisedOverTimeChart";
import RaiseSpotlight from "@/components/moneytracker/RaiseSpotlight";

const FLASH_DURATION_MS = 2000;
const ROWS_PER_PAGE = 6;
const CYCLE_INTERVAL_MS = 8000;
const MEDAL = ["#f2c744", "#c9ccd1", "#c9834f"]; // gold, silver, bronze — rank, not team identity

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

type StagePage = { type: "rows"; rows: TeamTotal[]; baseRank: number } | { type: "chart" };

export default function LeaderboardPage() {
  const { entries, loading, error, lastUpdated } = useMoneyTrackerData();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const now = useNow();
  const newEntries = useNewEntries(entries, loading);
  const [flashTeams, setFlashTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Leaderboard — T-0";
  }, []);

  // Flash whichever rows just received a raise instead of numbers silently
  // updating — driven by the same "what's new" signal as the spotlight.
  useEffect(() => {
    if (newEntries.length === 0) return;
    const teamsHit = Array.from(new Set(newEntries.map((e) => e.team)));

    const showTimeout = setTimeout(() => {
      setFlashTeams((prev) => new Set([...prev, ...teamsHit]));
    }, 0);
    const hideTimeout = setTimeout(() => {
      setFlashTeams((prev) => {
        const next = new Set(prev);
        teamsHit.forEach((team) => next.delete(team));
        return next;
      });
    }, FLASH_DURATION_MS);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [newEntries]);

  const colorMap = buildTeamColorMap(teams.map((t) => t.name));
  const activeTeamNames = teams.filter((t) => t.active).map((t) => t.name);
  const totals = computeTotals(entries, activeTeamNames, colorMap);
  const series = computeSeries(entries, activeTeamNames, colorMap);
  const isLoading = loading || teamsLoading;
  const combinedError = error || teamsError;
  const grandTotal = totals.reduce((sum, t) => sum + t.total, 0);

  const top3 = totals.slice(0, 3);
  const rest = totals.slice(3);
  const leader = totals[0]?.total ?? 0;
  // gold in the middle, silver left, bronze right — classic podium reading order
  const podiumOrder = [1, 0, 2].filter((i) => i < top3.length);

  // Nothing here scrolls — a venue TV has no one to scroll it. Once the
  // ranked list plus the chart don't fit one screen, they cycle through as
  // discrete pages instead (rows page(s), then the chart, on a loop).
  const rowPages: StagePage[] = chunk(rest, ROWS_PER_PAGE).map((rows, i) => ({
    type: "rows",
    rows,
    baseRank: i * ROWS_PER_PAGE + 4,
  }));
  const stagePages: StagePage[] = [...rowPages, { type: "chart" }];
  const pageIndex = useCyclingIndex(stagePages.length, CYCLE_INTERVAL_MS);
  const activePage = stagePages[pageIndex] ?? { type: "chart" };

  return (
    <main className="h-screen w-screen overflow-hidden bg-background text-foreground px-8 py-6 md:px-[3vw] md:py-7 flex flex-col">
      <RaiseSpotlight newEntries={newEntries} />
      <div className="max-w-[1800px] w-full mx-auto flex flex-col flex-1 min-h-0">
        <div className="flex-shrink-0 flex items-end justify-between gap-4 mb-2">
          <div>
            <p className="font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-1">
              FILE: LEADERBOARD{!isLoading && ` · ${totals.length} TEAMS`}
            </p>
            <h1 className="font-timer font-light text-2xl md:text-4xl 2xl:text-5xl" style={{ color: "#f0f4f8" }}>
              Who&apos;s raising the most.
            </h1>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono text-[10px] md:text-xs text-white/40 tracking-[0.25em] uppercase">Total raised</p>
            <p className="font-timer font-light text-2xl md:text-4xl 2xl:text-5xl tabular-nums" style={{ color: "#f0f4f8" }}>
              {formatCurrency(grandTotal)}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 mb-4">
          <span className={`inline-block w-2 h-2 rounded-full ${combinedError ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
          <span className="font-mono text-xs md:text-sm text-white/40 tracking-[0.2em] uppercase">
            {combinedError
              ? combinedError
              : lastUpdated
                ? `Live · updated ${Math.max(0, Math.round((now - lastUpdated) / 1000))}s ago`
                : "Connecting…"}
          </span>
        </div>

        {!isLoading && totals.length === 0 && (
          <p className="font-timer font-light text-lg text-white/40 py-16 text-center">
            {teams.length === 0 ? "No teams registered yet." : "No raises logged yet."}
          </p>
        )}

        {top3.length > 0 && (
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
            {podiumOrder.map((i) => {
              const t = top3[i];
              const isFirst = i === 0;
              return (
                <div
                  key={t.team}
                  className={`relative border p-5 md:p-6 flex flex-col ${isFirst ? "md:pb-8" : ""} ${
                    flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
                  }`}
                  style={{
                    borderColor: `${MEDAL[i]}55`,
                    boxShadow: `0 0 50px ${MEDAL[i]}1f`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-timer font-light text-3xl md:text-4xl 2xl:text-5xl tabular-nums" style={{ color: MEDAL[i] }}>
                      {i + 1}
                    </span>
                    <span className="inline-block w-3 h-3 2xl:w-4 2xl:h-4 flex-shrink-0" style={{ backgroundColor: t.color }} />
                  </div>
                  <p className="font-mono text-sm md:text-base 2xl:text-lg uppercase tracking-[0.08em] text-white/80 mb-2 truncate">
                    {t.team}
                  </p>
                  <p
                    className={`font-timer font-light tabular-nums ${isFirst ? "text-4xl md:text-6xl 2xl:text-7xl" : "text-3xl md:text-5xl 2xl:text-6xl"}`}
                    style={{ color: "#f0f4f8" }}
                  >
                    {formatCurrency(t.total)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {(rest.length > 0 || (!isLoading && series.length > 0 && entries.length > 0)) && (
          <div className="flex-1 min-h-0 flex flex-col">
            {activePage.type === "rows" ? (
              <div className="flex-1 min-h-0 flex flex-col border-t border-white/10">
                {activePage.rows.map((t, i) => (
                  <div
                    key={t.team}
                    className={`flex-1 min-h-0 flex items-center gap-4 md:gap-6 border-b border-white/10 ${
                      flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
                    }`}
                  >
                    <span className="font-timer font-light text-lg md:text-xl 2xl:text-2xl text-white/30 w-9 md:w-10 flex-shrink-0 tabular-nums">
                      {String(activePage.baseRank + i).padStart(2, "0")}
                    </span>
                    <span className="inline-block w-3 h-3 2xl:w-4 2xl:h-4 flex-shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="flex-1 min-w-0 font-mono text-sm md:text-base 2xl:text-lg tracking-[0.05em] uppercase text-white/80 truncate">
                      {t.team}
                    </span>
                    <div className="hidden md:block flex-1 max-w-[260px] 2xl:max-w-[360px] h-1.5 2xl:h-2 bg-white/10 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 transition-[width] duration-700"
                        style={{ width: `${leader > 0 ? (t.total / leader) * 100 : 0}%`, backgroundColor: t.color }}
                      />
                    </div>
                    <span className="font-timer font-light text-xl md:text-2xl 2xl:text-3xl tabular-nums flex-shrink-0" style={{ color: "#f0f4f8" }}>
                      {formatCurrency(t.total)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col">
                <p className="flex-shrink-0 font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-1">
                  FILE: RAISED OVER TIME
                </p>
                <h2 className="flex-shrink-0 font-timer font-light text-xl md:text-2xl 2xl:text-3xl mb-3" style={{ color: "#f0f4f8" }}>
                  Money raised, live.
                </h2>
                <div className="flex-1 min-h-0">
                  {isLoading ? (
                    <p className="font-timer font-light text-lg text-white/40 py-16 text-center">Loading…</p>
                  ) : entries.length === 0 ? (
                    <p className="font-timer font-light text-lg text-white/40 py-16 text-center">
                      No raises logged yet — the chart fills in as teams submit.
                    </p>
                  ) : (
                    <RaisedOverTimeChart series={series} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
