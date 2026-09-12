"use client";

import { useEffect, useState } from "react";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { useNewEntries } from "@/lib/useNewEntries";
import { computeTotals } from "@/lib/moneyTrackerMath";
import { buildTeamColorMap } from "@/lib/teamColors";
import { formatCurrency } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import RaiseSpotlight from "@/components/moneytracker/RaiseSpotlight";

const FLASH_DURATION_MS = 2000;
const ROW_HEIGHT_PX = 84;
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
  const isLoading = loading || teamsLoading;
  const combinedError = error || teamsError;
  const grandTotal = totals.reduce((sum, t) => sum + t.total, 0);

  const top3 = totals.slice(0, 3);
  const rest = totals.slice(3);
  const leader = totals[0]?.total ?? 0;
  // gold in the middle, silver left, bronze right — classic podium reading order
  const podiumOrder = [1, 0, 2].filter((i) => i < top3.length);

  // The ranked list is unbounded, so once it's taller than its box it
  // scrolls itself continuously (a vertical ticker) instead of requiring
  // anyone to scroll a venue TV by hand.
  const restScrollDurationS = Math.max(15, rest.length * 3);

  return (
    <main className="h-screen w-screen overflow-hidden bg-background text-foreground px-8 py-6 md:px-[3vw] md:py-8 flex flex-col">
      <RaiseSpotlight newEntries={newEntries} />
      <div className="max-w-[1800px] w-full mx-auto flex flex-col flex-1 min-h-0">
        <div className="flex-shrink-0 flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-1">
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

        <div className="flex-shrink-0 flex items-center gap-2 mb-6">
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
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 items-end">
            {podiumOrder.map((i) => {
              const t = top3[i];
              const isFirst = i === 0;
              return (
                <div
                  key={t.team}
                  className={`relative border p-5 md:p-7 flex flex-col ${isFirst ? "md:pb-10" : ""} ${
                    flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
                  }`}
                  style={{
                    borderColor: `${MEDAL[i]}55`,
                    boxShadow: `0 0 50px ${MEDAL[i]}1f`,
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-timer font-light text-3xl md:text-4xl 2xl:text-6xl tabular-nums" style={{ color: MEDAL[i] }}>
                      {i + 1}
                    </span>
                    <span className="inline-block w-3 h-3 2xl:w-4 2xl:h-4 flex-shrink-0" style={{ backgroundColor: t.color }} />
                  </div>
                  <p className="font-mono text-sm md:text-lg 2xl:text-xl uppercase tracking-[0.08em] text-white/80 mb-3 truncate">
                    {t.team}
                  </p>
                  <p
                    className={`font-timer font-light tabular-nums ${isFirst ? "text-4xl md:text-6xl 2xl:text-8xl" : "text-3xl md:text-5xl 2xl:text-7xl"}`}
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
          <div className="flex-1 min-h-0 overflow-hidden relative border-t border-white/10">
            <div
              className="flex flex-col"
              style={{ animation: `tickerScrollY ${restScrollDurationS}s linear infinite` }}
            >
              {[...rest, ...rest].map((t, i) => (
                <div
                  key={`${t.team}-${i}`}
                  className={`flex-shrink-0 flex items-center gap-4 md:gap-6 border-b border-white/10 ${
                    flashTeams.has(t.team) ? "animate-[liveFlash_2s_ease-out]" : ""
                  }`}
                  style={{ height: ROW_HEIGHT_PX }}
                >
                  <span className="font-timer font-light text-xl md:text-2xl 2xl:text-3xl text-white/30 w-10 flex-shrink-0 tabular-nums">
                    {String((i % rest.length) + 4).padStart(2, "0")}
                  </span>
                  <span className="inline-block w-3 h-3 2xl:w-4 2xl:h-4 flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="flex-1 min-w-0 font-mono text-sm md:text-base 2xl:text-lg tracking-[0.05em] uppercase text-white/80 truncate">
                    {t.team}
                  </span>
                  <div className="hidden md:block w-40 xl:w-64 flex-shrink-0 h-1.5 2xl:h-2 bg-white/10 relative overflow-hidden">
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
          </div>
        )}
      </div>
    </main>
  );
}
