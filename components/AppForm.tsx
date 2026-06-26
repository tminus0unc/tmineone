"use client";

import { useState } from "react";
import { submitForm } from "@/app/actions/submit";

const ALLOWED_EMAIL = [
  /@gmail\.com$/i,
  /\.edu$/i,
  /@yahoo\./i,
  /@hotmail\.com$/i,
  /@outlook\./i,
  /@icloud\.com$/i,
];

function validateEmail(email: string): string | null {
  if (!email.includes("@")) return "Enter a valid email address.";
  if (!ALLOWED_EMAIL.some((r) => r.test(email)))
    return "Use a .edu, Gmail, Yahoo, Hotmail, Outlook, or iCloud address.";
  return null;
}

export default function AppForm() {
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email    = formData.get("email") as string;

    const err = validateEmail(email);
    if (err) { setEmailErr(err); return; }
    setEmailErr("");

    setStatus("loading");
    const result = await submitForm(formData);
    if (result?.error) {
      setErrorMsg(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  }

  /* Shared underline field style */
  const fieldClass = `
    w-full bg-transparent border-0 border-b border-white/20
    pb-3 pt-1
    outline-none
    font-timer font-extralight text-base text-white/80
    placeholder:text-white/30
    focus:border-foreground transition-colors duration-300
  `;

  return (
    <div className="flex-1 flex items-center justify-center px-10 md:px-20 py-8">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="font-mono text-[11px] text-foreground tracking-[0.45em] uppercase mb-3 opacity-80">
            FILE: INTEREST_FORM.T-0
          </p>
          <h2 className="font-timer font-extralight text-3xl md:text-4xl text-white/92 leading-snug">
            Fill out to stay updated.
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-10">
            <div className="relative">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                required
                className={fieldClass}
              />
            </div>
            <div className="relative">
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                required
                className={fieldClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="name@institution.edu"
              required
              onChange={() => emailErr && setEmailErr("")}
              className={`${fieldClass} ${emailErr ? "border-red-400/60" : ""}`}
            />
            {emailErr && (
              <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-red-400/80 uppercase">
                {emailErr}
              </p>
            )}
          </div>

          {/* Submit row — text-only with growing underline */}
          <div className="flex items-center gap-8 pt-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="
                group relative inline-flex items-center gap-2
                font-mono text-[12px] uppercase tracking-[0.45em] text-foreground
                pb-1 transition-colors duration-300 hover:text-white
                disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              <span>{status === "loading" ? "Sending" : "Submit"}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              {/* growing underline */}
              <span className="absolute left-0 -bottom-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </button>

            {status === "success" && (
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-foreground/70">
                ✓ You're on the list
              </span>
            )}
            {status === "error" && (
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-red-400/80">
                ✗ {errorMsg}
              </span>
            )}
          </div>

        </form>

        {/* Footer rule — tightened */}
        <div className="mt-7 pt-3 border-t border-white/10 font-mono text-[9px] text-white/25 tracking-[0.35em] uppercase">
          INTEREST FORM · T-0 · CLEARANCE: OPEN
        </div>

      </div>
    </div>
  );
}
