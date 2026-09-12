"use client";

import { useEffect, useState } from "react";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { useNewEntries } from "@/lib/useNewEntries";
import { useAutoScroll } from "@/lib/useAutoScroll";
import { computeTotals, computeSeries } from "@/lib/moneyTrackerMath";
import { buildTeamColorMap } from "@/lib/teamColors";
import { formatCurrency } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import RaisedOverTimeChart from "@/components/moneytracker/RaisedOverTimeChart";
import RaiseSpotlight from "@/components/moneytracker/RaiseSpotlight";

const FLASH_DURATION_MS = 2000;
const MEDAL = ["#f2c744", "#c9ccd1", "#c9834f"]; // gold, silver, bronze — rank, not team identity

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

  useAutoScroll(!isLoading);

  const top3 = totals.slice(0, 3);
  const rest = totals.slice(3);
  const leader = totals[0]?.total ?? 0;
  // gold in the middle, silver left, bronze right — classic podium reading order
  const podiumOrder = [1, 0, 2].filter((i) => i < top3.length);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-10 md:px-[4vw] md:py-14">
      <RaiseSpotlight newEntries={newEntries} />
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-2">
              FILE: LEADERBOARD{!isLoading && ` · ${totals.length} TEAMS`}
            </p>
            <h1 className="font-timer font-light text-3xl md:text-5xl 2xl:text-6xl" style={{ color: "#f0f4f8" }}>
              Who&apos;s raising the most.
            </h1>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono text-[10px] md:text-xs text-white/40 tracking-[0.25em] uppercase">Total raised</p>
            <p className="font-timer font-light text-3xl md:text-5xl 2xl:text-6xl tabular-nums" style={{ color: "#f0f4f8" }}>
              {formatCurrency(grandTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10">
          <span className={`inline-block w-2 h-2 rounded-full ${combinedError ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
          <span className="font-mono text-xs md:text-sm 2xl:text-base text-white/40 tracking-[0.2em] uppercase">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 items-end">
            {podiumOrder.map((i) => {
              const t = top3[i];
              const isFirst = i === 0;
              return (
                <div
                  key={t.team}
                  className={`relative border p-6 md:p-9 flex flex-col ${isFirst ? "md:pb-12" : ""} ${
                    flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
                  }`}
                  style={{
                    borderColor: `${MEDAL[i]}55`,
                    boxShadow: `0 0 50px ${MEDAL[i]}1f`,
                  }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-timer font-light text-4xl md:text-5xl 2xl:text-6xl tabular-nums" style={{ color: MEDAL[i] }}>
                      {i + 1}
                    </span>
                    <span className="inline-block w-3 h-3 2xl:w-4 2xl:h-4 flex-shrink-0" style={{ backgroundColor: t.color }} />
                  </div>
                  <p className="font-mono text-sm md:text-lg 2xl:text-xl uppercase tracking-[0.08em] text-white/80 mb-4 truncate">
                    {t.team}
                  </p>
                  <p
                    className={`font-timer font-light tabular-nums ${isFirst ? "text-5xl md:text-7xl 2xl:text-8xl" : "text-4xl md:text-6xl 2xl:text-7xl"}`}
                    style={{ color: "#f0f4f8" }}
                  >
                    {formatCurrency(t.total)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {rest.length > 0 && (
          <div className="border-t border-white/10 mb-14">
            {rest.map((t, i) => (
              <div
                key={t.team}
                className={`flex items-center gap-4 md:gap-6 py-4 md:py-5 border-b border-white/10 ${
                  flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
                }`}
              >
                <span className="font-timer font-light text-xl md:text-2xl 2xl:text-3xl text-white/30 w-9 md:w-10 2xl:w-12 flex-shrink-0 tabular-nums">
                  {String(i + 4).padStart(2, "0")}
                </span>
                <span className="inline-block w-3 h-3 2xl:w-4 2xl:h-4 flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="flex-1 min-w-0 font-mono text-sm md:text-lg 2xl:text-xl tracking-[0.05em] uppercase text-white/80 truncate">
                  {t.team}
                </span>
                <div className="hidden md:block flex-1 max-w-[260px] 2xl:max-w-[360px] h-1.5 2xl:h-2 bg-white/10 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-700"
                    style={{ width: `${leader > 0 ? (t.total / leader) * 100 : 0}%`, backgroundColor: t.color }}
                  />
                </div>
                <span className="font-timer font-light text-2xl md:text-3xl 2xl:text-4xl tabular-nums flex-shrink-0" style={{ color: "#f0f4f8" }}>
                  {formatCurrency(t.total)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={rest.length === 0 && top3.length > 0 ? "mt-14" : ""}>
          <p className="font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-2">
            FILE: RAISED OVER TIME
          </p>
          <h2 className="font-timer font-light text-2xl md:text-4xl mb-7" style={{ color: "#f0f4f8" }}>
            Money raised, live.
          </h2>

          {isLoading ? (
            <p className="font-timer font-light text-lg text-white/40 py-16 text-center">Loading…</p>
          ) : activeTeamNames.length === 0 ? (
            <p className="font-timer font-light text-lg text-white/40 py-16 text-center">No teams registered yet.</p>
          ) : entries.length === 0 ? (
            <p className="font-timer font-light text-lg text-white/40 py-16 text-center">
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
