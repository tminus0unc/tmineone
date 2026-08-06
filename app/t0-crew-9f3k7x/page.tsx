"use client";

import { useEffect, useState } from "react";
import { addReferral } from "@/app/actions/addReferral";

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

  useEffect(() => {
    document.title = "Add Referral";
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
  }

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
        </div>
      </div>
    </main>
  );
}
