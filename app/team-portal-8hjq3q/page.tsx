"use client";

import { useEffect, useState } from "react";
import { addTeam, deleteTeam, updateTeam, type Team } from "@/app/actions/teams";
import { useTeams } from "@/lib/useTeams";

const fieldClass = `
  w-full bg-transparent border-0 border-b border-white/20
  pb-3 pt-1
  outline-none
  font-timer font-extralight text-base text-white/80
  placeholder:text-white/30
  focus:border-foreground transition-colors duration-300
`;

type Edit = { name: string; form_url: string };

export default function TeamPortalPage() {
  const { teams, error: loadError, loading, refresh } = useTeams();
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [addStatus, setAddStatus] = useState<"idle" | "loading" | "error">("idle");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    document.title = "Team Portal — T-0";
  }, []);

  function valueFor(team: Team): Edit {
    return edits[team.id] ?? { name: team.name, form_url: team.form_url ?? "" };
  }

  function setField(team: Team, patch: Partial<Edit>) {
    setEdits((prev) => ({ ...prev, [team.id]: { ...valueFor(team), ...patch } }));
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setAddStatus("loading");
    const result = await addTeam(formData);
    if (result?.error) {
      setAddError(result.error);
      setAddStatus("error");
      return;
    }
    setAddStatus("idle");
    form.reset();
    refresh();
  }

  async function handleSave(team: Team) {
    const value = valueFor(team);
    setSavingIds((prev) => new Set(prev).add(team.id));
    setRowErrors((prev) => {
      const next = { ...prev };
      delete next[team.id];
      return next;
    });

    const result = await updateTeam(team.id, {
      name: value.name.trim(),
      form_url: value.form_url.trim() || null,
    });

    setSavingIds((prev) => {
      const next = new Set(prev);
      next.delete(team.id);
      return next;
    });

    if (result?.error) {
      setRowErrors((prev) => ({ ...prev, [team.id]: result.error! }));
      return;
    }

    setEdits((prev) => {
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
          <h1 className="font-timer font-light text-2xl md:text-3xl mb-8" style={{ color: "#f0f4f8" }}>
            Manage competing teams.
          </h1>

          <form onSubmit={handleAdd} className="space-y-6 mb-12 pb-8 border-b border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="name" type="text" placeholder="Team name" required className={fieldClass} />
              <input name="formUrl" type="url" placeholder="Form link, just for your reference (optional)" className={fieldClass} />
            </div>
            <div className="flex items-center gap-6">
              <button
                type="submit"
                disabled={addStatus === "loading"}
                className="font-mono text-[12px] uppercase tracking-[0.4em] text-foreground transition-colors duration-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {addStatus === "loading" ? "Adding" : "Add team →"}
              </button>
              {addStatus === "error" && (
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400/80">✗ {addError}</span>
              )}
            </div>
          </form>

          {loadError && <p className="font-mono text-[11px] text-red-400/80 uppercase tracking-[0.2em] mb-6">{loadError}</p>}

          <div className="space-y-6">
            {teams.map((team) => {
              const value = valueFor(team);
              const isSaving = savingIds.has(team.id);
              const isSaved = savedIds.has(team.id);
              const rowError = rowErrors[team.id];
              return (
                <div key={team.id} className={`space-y-3 pb-6 border-b border-white/10 ${team.active ? "" : "opacity-40"}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      value={value.name}
                      onChange={(e) => setField(team, { name: e.target.value })}
                      className={fieldClass}
                    />
                    <div>
                      <input
                        value={value.form_url}
                        onChange={(e) => setField(team, { form_url: e.target.value })}
                        placeholder="Form link, just for your reference"
                        className={fieldClass}
                      />
                      <p className="font-mono text-[9px] text-white/30 tracking-[0.15em] uppercase mt-1.5">
                        {team.form_id ? "Linked to a submitted form ✓" : "Not linked yet — links automatically on first submission"}
                      </p>
                    </div>
                  </div>
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
                    {team.form_url && (
                      <a
                        href={team.form_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/70 hover:text-white transition-colors duration-300"
                      >
                        Open ↗
                      </a>
                    )}
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
              <p className="font-timer font-light text-sm text-white/40">No teams yet — add the first one above.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
