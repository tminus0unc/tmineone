"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMoneyTrackerData } from "@/lib/useMoneyTrackerData";
import { useTeams } from "@/lib/useTeams";
import { computeSeries } from "@/lib/moneyTrackerMath";
import { buildTeamColorMap } from "@/lib/teamColors";
import RaisedOverTimeChart from "@/components/moneytracker/RaisedOverTimeChart";

export default function GraphPage() {
  const { entries, loading, error } = useMoneyTrackerData();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();

  useEffect(() => {
    document.title = "Raised Over Time — T-0";
  }, []);

  const colorMap = buildTeamColorMap(teams.map((t) => t.name));
  const activeTeamNames = teams.filter((t) => t.active).map((t) => t.name);
  const series = computeSeries(entries, activeTeamNames, colorMap);
  const isLoading = loading || teamsLoading;
  const combinedError = error || teamsError;

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 md:px-12 md:py-14">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[10px] md:text-[11px] text-white/50 tracking-[0.4em] uppercase mb-1">
            FILE: RAISED OVER TIME
          </p>
          <h1 className="font-timer font-light text-2xl md:text-3xl" style={{ color: "#f0f4f8" }}>
            Money raised, live.
          </h1>
        </div>

        {isLoading ? (
          <p className="font-timer font-light text-sm text-white/40 py-16 text-center">Loading…</p>
        ) : combinedError ? (
          <p className="font-mono text-[11px] text-red-400/80 uppercase tracking-[0.2em] py-16 text-center">{combinedError}</p>
        ) : activeTeamNames.length === 0 ? (
          <p className="font-timer font-light text-sm text-white/40 py-16 text-center">No teams registered yet.</p>
        ) : entries.length === 0 ? (
          <p className="font-timer font-light text-sm text-white/40 py-16 text-center">
            No raises logged yet — the chart fills in as teams submit.
          </p>
        ) : (
          <RaisedOverTimeChart series={series} />
        )}

        <p className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase mt-10">
          Prefer numbers? See the{" "}
          <Link href="/leaderboard" className="underline hover:text-white/60">
            leaderboard
          </Link>{" "}
          or the{" "}
          <Link href="/transactions" className="underline hover:text-white/60">
            transaction feed
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
