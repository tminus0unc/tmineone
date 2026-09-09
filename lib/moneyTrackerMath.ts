import type { MoneyEntry } from "@/app/actions/moneyTracker";
import { colorForTeam } from "@/lib/teamColors";

export type TeamTotal = { team: string; total: number; color: string };

export function computeTotals(
  entries: MoneyEntry[],
  displayTeamNames: string[],
  colorMap: Map<string, string>
): TeamTotal[] {
  const totals = new Map<string, number>(displayTeamNames.map((t) => [t, 0]));
  entries.forEach((e) => {
    if (!totals.has(e.team)) return; // not on the active roster — excluded from display
    totals.set(e.team, (totals.get(e.team) ?? 0) + e.amount);
  });

  return Array.from(totals.entries())
    .map(([team, total]) => ({ team, total, color: colorForTeam(colorMap, team) }))
    .sort((a, b) => b.total - a.total);
}

export type SeriesPoint = { time: number; value: number };
export type TeamSeries = { team: string; color: string; total: number; points: SeriesPoint[] };

// Cumulative step series per team, extended to `now` so every line reaches
// the live edge of the chart even between raises.
export function computeSeries(
  entries: MoneyEntry[],
  displayTeamNames: string[],
  colorMap: Map<string, string>,
  now: number = Date.now()
): TeamSeries[] {
  const displaySet = new Set(displayTeamNames);
  const relevantEntries = entries.filter((e) => displaySet.has(e.team));
  const startTime = relevantEntries.length ? new Date(relevantEntries[0].created_at).getTime() : now;

  const byTeam = new Map<string, SeriesPoint[]>();
  const running = new Map<string, number>();
  displayTeamNames.forEach((t) => {
    byTeam.set(t, [{ time: startTime, value: 0 }]);
    running.set(t, 0);
  });

  relevantEntries.forEach((e) => {
    const next = (running.get(e.team) ?? 0) + e.amount;
    running.set(e.team, next);
    byTeam.get(e.team)!.push({ time: new Date(e.created_at).getTime(), value: next });
  });

  byTeam.forEach((points) => {
    const last = points[points.length - 1];
    if (last.time < now) points.push({ time: now, value: last.value });
  });

  return Array.from(byTeam.entries())
    .map(([team, points]) => ({ team, color: colorForTeam(colorMap, team), points, total: running.get(team) ?? 0 }))
    .sort((a, b) => b.total - a.total);
}
