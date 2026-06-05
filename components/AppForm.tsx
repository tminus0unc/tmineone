"use client";

import { useState } from "react";
import { submitForm } from "@/app/actions/submit";

export default function AppForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const result = await submitForm(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  }

  const inputClass = `
    w-full bg-transparent
    border border-foreground/80 hover:border-foreground focus:border-foreground
    px-3 py-2 md:px-5 md:py-4
    outline-none
    font-mono text-[10px] md:text-sm text-forground/80 tracking-[0.2em] uppercase
    placeholder:text-foreground/30
    transition-colors duration-200
  `;

  return (
      <div className="flex-1 flex items-center justify-center px-4 md:px-12 py-6 md:py-8">
        <div className="w-full max-w-xs md:max-w-2xl">

          {/* Header */}
          <div className="mb-6 md:mb-10">
            <p className="font-mono text-[9px] md:text-[11px] text-foreground/40 tracking-[0.4em] uppercase mb-2 md:mb-3">
              FILE: APPLICATION
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
             Apply Here
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
            <div className="flex flex-col md:flex-row gap-3 md:gap-5">
              <input
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  required
                  className={inputClass}
              />
              <input
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  required
                  className={inputClass}
              />
            </div>

            <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className={inputClass}
            />

            {/* Submit row */}
            <div className="flex items-center gap-4 md:gap-6 pt-1 md:pt-2">
              <button
                  type="submit"
                  disabled={status === "loading"}
                  className="
                border border-foreground/80 px-6 md:px-8 py-2 md:py-3
                text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] text-foreground
                transition-all duration-300 hover:border-foreground
                hover:bg-foreground/5 hover:text-white
                font-mono disabled:opacity-30 disabled:cursor-not-allowed
              "
              >
                {status === "loading" ? "Transmitting..." : "Submit"}
              </button>

              {status === "success" && (
                  <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-foreground/60">
                    ✓ Received
                  </p>
              )}
              {status === "error" && (
                  <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-red-400/70">
                    ✗ {errorMsg}
                  </p>
              )}
            </div>
          </form>

          {/* Footer metadata */}
          <div className="mt-6 md:mt-10 pt-3 md:pt-4 border-t border-foreground/10 font-mono text-[9px] md:text-[10px] text-foreground/20 tracking-[0.3em] uppercase">
            FORM T-0 · CLEARANCE: OPEN · REQUIRED FIELDS: 3
          </div>
        </div>
      </div>
  );
}