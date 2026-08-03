"use client";

import { useState } from "react";
import Link from "next/link";
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

function validateLinkedIn(url: string): string | null {
  if (!/linkedin\.com\//i.test(url)) return "Paste a valid LinkedIn profile URL.";
  return null;
}

export default function IntroForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [linkedinErr, setLinkedinErr] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const linkedin = formData.get("linkedin") as string;

    const eErr = validateEmail(email);
    const lErr = validateLinkedIn(linkedin);
    setEmailErr(eErr || "");
    setLinkedinErr(lErr || "");
    if (eErr || lErr) return;

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

  const fieldClass = `
    w-full bg-transparent border-0 border-b border-white/20
    pb-3 pt-1
    outline-none
    font-timer font-extralight text-base text-white/80
    placeholder:text-white/30
    focus:border-foreground transition-colors duration-300
  `;

  if (status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-foreground/70">
          ✓ Thanks for introducing yourself.
        </p>
        <Link
          href="/#Challenge"
          className="
            group relative inline-flex items-center gap-2 w-fit
            font-mono text-[12px] uppercase tracking-[0.45em] text-foreground
            pb-1 transition-colors duration-300 hover:text-white
          "
        >
          <span>Return to Home</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          <span className="absolute left-0 -bottom-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    );
  }

  return (
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
          placeholder="Email"
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

      {/* LinkedIn */}
      <div>
        <input
          name="linkedin"
          type="url"
          placeholder="LinkedIn"
          required
          onChange={() => linkedinErr && setLinkedinErr("")}
          className={`${fieldClass} ${linkedinErr ? "border-red-400/60" : ""}`}
        />
        {linkedinErr && (
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-red-400/80 uppercase">
            {linkedinErr}
          </p>
        )}
      </div>

      {/* UNC student checkbox */}
      <label className="group flex items-center gap-3 cursor-pointer w-fit">
        <span className="relative flex-shrink-0 w-4 h-4">
          <input
            name="isUncStudent"
            type="checkbox"
            className="peer absolute inset-0 z-10 opacity-0 cursor-pointer"
          />
          <span
            className="
              absolute inset-0 border border-white/30
              transition-colors duration-300
              peer-checked:border-foreground peer-checked:bg-foreground/15
              group-hover:border-white/50
              pointer-events-none
            "
          />
          <span
            className="
              absolute inset-0 flex items-center justify-center
              text-foreground text-[11px] leading-none
              opacity-0 peer-checked:opacity-100 transition-opacity duration-200
              pointer-events-none
            "
          >
            ✓
          </span>
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 group-hover:text-white/80 transition-colors duration-300">
          I&apos;m a UNC student
        </span>
      </label>

      {/* Submit row */}
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
          <span className="absolute left-0 -bottom-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
        </button>

        {status === "error" && (
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-red-400/80">
            ✗ {errorMsg}
          </span>
        )}
      </div>

    </form>
  );
}
