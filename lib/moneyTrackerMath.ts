import type { MoneyEntry } from "@/app/actions/moneyTracker";
import { colorForTeam } from "@/lib/teamColors";

function normalizeTeamName(name: string): string {
  return name.trim().toLowerCase();
}

// Maps a raw entry's team string (as typed into a form title) to the
// portal's canonical spelling, so a stray space or casing difference across
// 19+ hand-duplicated forms can't silently drop a team's raises.
function canonicalNameLookup(displayTeamNames: string[]): Map<string, string> {
  return new Map(displayTeamNames.map((t) => [normalizeTeamName(t), t]));
}

export type TeamTotal = { team: string; total: number; color: string };

export function computeTotals(
  entries: MoneyEntry[],
  displayTeamNames: string[],
  colorMap: Map<string, string>
): TeamTotal[] {
  const canonicalByNormalized = canonicalNameLookup(displayTeamNames);
  const totals = new Map<string, number>(displayTeamNames.map((t) => [t, 0]));

  entries.forEach((e) => {
    const canonical = canonicalByNormalized.get(normalizeTeamName(e.team));
    if (!canonical) return; // not on the active roster — excluded from display
    totals.set(canonical, (totals.get(canonical) ?? 0) + e.amount);
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
  const canonicalByNormalized = canonicalNameLookup(displayTeamNames);
  const relevantEntries = entries
    .map((e) => ({ ...e, team: canonicalByNormalized.get(normalizeTeamName(e.team)) }))
    .filter((e): e is MoneyEntry => Boolean(e.team));
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
