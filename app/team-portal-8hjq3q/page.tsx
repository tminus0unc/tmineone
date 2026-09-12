"use client";

import { useEffect, useState } from "react";
import { deleteTeam, updateTeam, type Team } from "@/app/actions/teams";
import { useTeams } from "@/lib/useTeams";

const fieldClass = `
  w-full bg-transparent border-0 border-b border-white/20
  pb-3 pt-1
  outline-none
  font-timer font-extralight text-base text-white/80
  placeholder:text-white/30
  focus:border-foreground transition-colors duration-300
`;

export default function TeamPortalPage() {
  const { teams, error: loadError, loading, refresh } = useTeams();
  const [names, setNames] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = "Team Portal — T-0";
  }, []);

  function nameFor(team: Team): string {
    return names[team.id] ?? team.name;
  }

  async function handleSave(team: Team) {
    const value = nameFor(team).trim();
    setSavingIds((prev) => new Set(prev).add(team.id));
    setRowErrors((prev) => {
      const next = { ...prev };
      delete next[team.id];
      return next;
    });

    const result = await updateTeam(team.id, { name: value });

    setSavingIds((prev) => {
      const next = new Set(prev);
      next.delete(team.id);
      return next;
    });

    if (result?.error) {
      setRowErrors((prev) => ({ ...prev, [team.id]: result.error! }));
      return;
    }

    setNames((prev) => {
      const next = { ...prev };
      delete next[team.id];
      return next;
    });
    setSavedIds((prev) => new Set(prev).add(team.id));
    setTimeout(() => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(team.id);
        return next;
      });
    }, 1500);
    refresh();
  }

  async function handleToggleActive(team: Team) {
    await updateTeam(team.id, { active: !team.active });
    refresh();
  }

  async function handleDelete(team: Team) {
    if (!window.confirm(`Delete "${team.name}"? This cannot be undone.`)) return;
    await deleteTeam(team.id);
    refresh();
  }

  return (
    <main className="relative min-h-screen bg-background overflow-y-auto">
      <div className="relative min-h-screen px-5 sm:px-6 md:px-10 py-16">
        <div className="w-full max-w-2xl mx-auto">
          <p className="font-mono text-[10px] text-foreground tracking-[0.4em] uppercase mb-1 opacity-80">FILE: TEAM PORTAL</p>
          <h1 className="font-timer font-light text-2xl md:text-3xl mb-2" style={{ color: "#f0f4f8" }}>
            Manage competing teams.
          </h1>
          <p className="font-timer font-light text-sm text-white/40 mb-8">
            Teams register themselves the first time their form submits. Use this to fix a name, hide a team, or
            remove a mistake.
          </p>

          {loadError && <p className="font-mono text-[11px] text-red-400/80 uppercase tracking-[0.2em] mb-6">{loadError}</p>}

          <div className="space-y-5">
            {teams.map((team) => {
              const isSaving = savingIds.has(team.id);
              const isSaved = savedIds.has(team.id);
              const rowError = rowErrors[team.id];
              return (
                <div key={team.id} className={`space-y-3 pb-5 border-b border-white/10 ${team.active ? "" : "opacity-40"}`}>
                  <input value={nameFor(team)} onChange={(e) => setNames((prev) => ({ ...prev, [team.id]: e.target.value }))} className={fieldClass} />
                  <div className="flex items-center gap-5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSave(team)}
                      disabled={isSaving}
                      className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:text-white disabled:opacity-30"
                    >
                      {isSaving ? "Saving" : isSaved ? "Saved ✓" : "Save"}
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">
                      <input
                        type="checkbox"
                        checked={team.active}
                        onChange={() => handleToggleActive(team)}
                        className="h-3.5 w-3.5 accent-foreground"
                      />
                      Active
                    </label>
                    <span className="font-mono text-[9px] text-white/30 tracking-[0.15em] uppercase">
                      {team.form_id ? "Form linked ✓" : "No form linked yet"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(team)}
                      className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400/70 hover:text-red-400 transition-colors duration-300 ml-auto"
                    >
                      Delete
                    </button>
                    {rowError && <span className="font-mono text-[10px] text-red-400/80 uppercase tracking-[0.2em]">✗ {rowError}</span>}
                  </div>
                </div>
              );
            })}
            {!loading && teams.length === 0 && (
              <p className="font-timer font-light text-sm text-white/40">
                No teams yet — they&apos;ll appear here automatically once a form submits.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
