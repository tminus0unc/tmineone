"use client";

import { useEffect, useState } from "react";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { useNewEntries } from "@/lib/useNewEntries";
import { computeSeries } from "@/lib/moneyTrackerMath";
import { buildTeamColorMap, colorForTeam } from "@/lib/teamColors";
import { formatCurrency } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import RaisedOverTimeChart from "@/components/moneytracker/RaisedOverTimeChart";
import RaiseSpotlight from "@/components/moneytracker/RaiseSpotlight";
import type { MoneyEntry } from "@/app/actions/moneyTracker";

const FLASH_DURATION_MS = 2000;
const MAX_VISIBLE_CARDS = 6; // 2 cols x 3 rows — a static "most recent" snapshot, no cycling

function timeAgo(iso: string, now: number): string {
  const diff = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function Ticker({ feed, colorMap }: { feed: MoneyEntry[]; colorMap: Map<string, string> }) {
  if (feed.length === 0) return null;
  const durationS = Math.max(20, feed.length * 4);

  return (
    <div className="flex-shrink-0 relative overflow-hidden border-y border-white/10 py-4 mb-5 bg-white/[0.02]">
      <div className="flex gap-14 whitespace-nowrap w-max" style={{ animation: `tickerScroll ${durationS}s linear infinite` }}>
        {[...feed, ...feed].map((entry, i) => (
          <span key={i} className="flex items-center gap-3 font-mono text-lg md:text-2xl 2xl:text-3xl uppercase tracking-[0.08em] flex-shrink-0">
            <span className="inline-block w-3 h-3 flex-shrink-0" style={{ backgroundColor: colorForTeam(colorMap, entry.team) }} />
            <span className="text-white/70">{entry.team}</span>
            <span className="text-emerald-400 font-semibold tabular-nums">+{formatCurrency(entry.amount)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { entries, loading, error, lastUpdated } = useMoneyTrackerData();
  const { teams } = useTeams();
  const now = useNow();
  const newEntries = useNewEntries(entries, loading);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Live Transactions — T-0";
  }, []);

  useEffect(() => {
    if (newEntries.length === 0) return;
    const ids = newEntries.map((e) => e.id);

    const showTimeout = setTimeout(() => {
      setFlashIds((prev) => new Set([...prev, ...ids]));
    }, 0);
    const hideTimeout = setTimeout(() => {
      setFlashIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
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
  const series = computeSeries(entries, activeTeamNames, colorMap);
  const feed = [...entries].reverse();
  const visibleCards = feed.slice(0, MAX_VISIBLE_CARDS);

  return (
    <main className="h-screen w-screen overflow-hidden bg-background text-foreground px-8 py-6 md:px-[3vw] md:py-7 flex flex-col">
      <RaiseSpotlight newEntries={newEntries} />
      <div className="max-w-[1800px] w-full mx-auto flex flex-col flex-1 min-h-0">
        <p className="flex-shrink-0 font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-1">
          FILE: TRANSACTIONS
        </p>
        <h1 className="flex-shrink-0 font-timer font-light text-2xl md:text-4xl 2xl:text-5xl mb-2" style={{ color: "#f0f4f8" }}>
          Live raises.
        </h1>

        <div className="flex-shrink-0 flex items-center gap-2 mb-4">
          <span className={`inline-block w-2 h-2 rounded-full ${error ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
          <span className="font-mono text-xs md:text-sm 2xl:text-base text-white/40 tracking-[0.2em] uppercase">
            {error
              ? error
              : lastUpdated
                ? `Live · updated ${Math.max(0, Math.round((now - lastUpdated) / 1000))}s ago`
                : "Connecting…"}
          </span>
        </div>

        <Ticker feed={feed} colorMap={colorMap} />

        <div className="flex-1 min-h-0 flex gap-8">
          <div className="w-[42%] flex-shrink-0 flex flex-col min-h-0">
            <p className="flex-shrink-0 font-mono text-[11px] md:text-[13px] text-white/50 tracking-[0.4em] uppercase mb-1">
              FILE: RAISED OVER TIME
            </p>
            <h2 className="flex-shrink-0 font-timer font-light text-xl md:text-2xl 2xl:text-3xl mb-3" style={{ color: "#f0f4f8" }}>
              Money raised, live.
            </h2>
            <div className="flex-1 min-h-0">
              {entries.length === 0 ? (
                <p className="font-timer font-light text-lg text-white/40 py-16 text-center">
                  No raises logged yet — the chart fills in as teams submit.
                </p>
              ) : (
                <RaisedOverTimeChart series={series} showLegend={false} />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 grid grid-cols-1 xl:grid-cols-2 grid-rows-3 gap-4 md:gap-5">
            {visibleCards.map((entry) => (
              <div
                key={entry.id}
                className={`min-h-0 flex gap-5 border p-4 md:p-5 transition-colors duration-500 overflow-hidden ${
                  flashIds.has(entry.id) ? "border-emerald-400/50 animate-[liveFlash_2s_ease-out]" : "border-white/10"
                }`}
              >
                {entry.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.image_url} alt="" className="w-16 h-16 md:w-20 md:h-20 object-cover flex-shrink-0 border border-white/10" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="flex items-center gap-2 font-mono text-sm md:text-base tracking-[0.1em] uppercase text-white/70 truncate">
                      <span className="inline-block w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: colorForTeam(colorMap, entry.team) }} />
                      {entry.team}
                    </span>
                    <span className="font-mono text-[10px] md:text-xs text-white/30 tracking-[0.15em] uppercase flex-shrink-0">
                      {timeAgo(entry.created_at, now)}
                    </span>
                  </div>
                  <p className="font-timer font-light text-xl md:text-3xl 2xl:text-4xl tabular-nums" style={{ color: "#f0f4f8" }}>
                    {formatCurrency(entry.amount)}
                  </p>
                  {entry.method && <p className="font-timer font-light text-sm md:text-base 2xl:text-lg text-white/50 mt-0.5 truncate">{entry.method}</p>}
                </div>
              </div>
            ))}
            {!loading && feed.length === 0 && (
              <p className="font-timer font-light text-lg text-white/40 py-10 text-center col-span-full">No raises logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
