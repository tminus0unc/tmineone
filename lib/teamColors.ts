// Validated categorical palette (dark surface #0c1115) — fixed hue order is
// the colorblind-safety mechanism, never reassign by rank or value.
const TEAM_PALETTE = [
  "#3987e5", // blue
  "#199e70", // aqua
  "#c98500", // yellow
  "#008300", // green
  "#9085e9", // violet
  "#e66767", // red
  "#d55181", // magenta
  "#d95926", // orange
];

const FALLBACK_COLOR = "#6b7280"; // unregistered team — shouldn't normally happen

// Color is assigned by each team's position in `orderedTeamNames` (pass the
// full roster in creation order) so a team keeps its color even when other
// teams are deactivated/filtered out of what's actually displayed.
export function buildTeamColorMap(orderedTeamNames: string[]): Map<string, string> {
  const map = new Map<string, string>();
  orderedTeamNames.forEach((name, i) => map.set(name, TEAM_PALETTE[i % TEAM_PALETTE.length]));
  return map;
}

export function colorForTeam(colorMap: Map<string, string>, team: string): string {
  return colorMap.get(team) ?? FALLBACK_COLOR;
}
