"use client";

import { useEffect, useState } from "react";
import { addReferral, getReferrals, setReferralContacted, type Referral } from "@/app/actions/addReferral";

type Status = "idle" | "loading" | "error";

const fieldClass = `
  w-full bg-transparent border-0 border-b border-white/20
  pb-3 pt-1
  outline-none
  font-timer font-extralight text-base text-white/80
  placeholder:text-white/30
  focus:border-foreground transition-colors duration-300
`;

export default function AddReferralPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [origin, setOrigin] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [onlyUncontacted, setOnlyUncontacted] = useState(false);

  async function refreshReferrals() {
    const result = await getReferrals();
    if (result.referrals) setReferrals(result.referrals);
  }

  useEffect(() => {
    document.title = "Add Referral";
    setOrigin(window.location.origin);
    refreshReferrals();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();

    setStatus("loading");
    const result = await addReferral(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setStatus("error");
      return;
    }

    setStatus("idle");
    setAdded((prev) => [`${firstName} ${lastName}`, ...prev]);
    form.reset();
    form.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus();
    refreshReferrals();
  }

  function inviteLinkFor(id: string) {
    return `${origin}/invite?ref=${id}`;
  }

  async function handleCopy(id: string) {
    await navigator.clipboard.writeText(inviteLinkFor(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
  }

  async function handleToggleContacted(id: string, next: boolean) {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, contacted: next } : r)));
    const result = await setReferralContacted(id, next);
    if (result?.error) {
      setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, contacted: !next } : r)));
    }
  }

  function statusClass(status: string | null) {
    if (status === "accepted") return "text-emerald-400/80";
    if (status === "declined") return "text-red-400/70";
    return "text-white/30";
  }

  const visibleReferrals = onlyUncontacted ? referrals.filter((r) => !r.contacted) : referrals;

  return (
    <main className="relative min-h-screen bg-background overflow-y-auto">
      <div className="relative flex min-h-screen items-center justify-center px-5 sm:px-6 md:px-10 py-16">
        <div className="w-full max-w-md">
          <p className="font-mono text-[10px] text-foreground tracking-[0.4em] uppercase mb-6 opacity-80">
            Add referral
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                required
                className={fieldClass}
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                required
                className={fieldClass}
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  font-mono text-[12px] uppercase tracking-[0.4em] text-foreground
                  transition-colors duration-300 hover:text-white
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
              >
                {status === "loading" ? "Adding" : "Add →"}
              </button>

              {status === "error" && (
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400/80">
                  ✗ {errorMsg}
                </span>
              )}
            </div>
          </form>

          {added.length > 0 && (
            <div className="mt-10 pt-4 border-t border-white/10">
              <p className="font-mono text-[9px] text-white/30 tracking-[0.3em] uppercase mb-3">
                Added this session ({added.length})
              </p>
              <ul className="space-y-1">
                {added.map((name, i) => (
                  <li
                    key={i}
                    className="font-timer font-light text-sm text-white/60"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {referrals.length > 0 && (
            <div className="mt-10 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="font-mono text-[9px] text-white/30 tracking-[0.3em] uppercase">
                  Invite links ({referrals.length}) · Contacted (
                  {referrals.filter((r) => r.contacted).length}/{referrals.length})
                </p>
                <label className="flex items-center gap-2 shrink-0 cursor-pointer font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">
                  <input
                    type="checkbox"
                    checked={onlyUncontacted}
                    onChange={(e) => setOnlyUncontacted(e.target.checked)}
                    className="h-3 w-3 accent-foreground"
                  />
                  Uncontacted only
                </label>
              </div>
              {visibleReferrals.length === 0 && (
                <p className="font-timer font-light text-sm text-white/40">
                  {"Everyone's been contacted."}
                </p>
              )}
              <ul className="space-y-3">
                {visibleReferrals.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <label className="flex items-center gap-3 shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={r.contacted}
                        onChange={(e) => handleToggleContacted(r.id, e.target.checked)}
                        className="h-3.5 w-3.5 accent-foreground"
                      />
                    </label>
                    <div className="min-w-0 flex-1">
                      <p className="font-timer font-light text-sm text-white/70 truncate">
                        {r.first_name} {r.last_name}{" "}
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.2em] ${statusClass(r.status)}`}
                        >
                          {r.status ?? "pending"}
                        </span>
                      </p>
                      <p className="font-mono text-[10px] text-white/40 truncate">
                        {inviteLinkFor(r.id)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(r.id)}
                      className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:text-white"
                    >
                      {copiedId === r.id ? "Copied" : "Copy"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
