"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitInvite } from "@/app/actions/submitInvite";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";

const GROUPME_INVITE_URL = process.env.NEXT_PUBLIC_GROUPME_URL;

type Invite = "accept" | "decline" | null;
type Status = "idle" | "loading" | "success" | "error";

const fieldClass = `
  w-full bg-transparent border-0 border-b border-white/20
  pb-3 pt-1
  outline-none
  font-timer font-extralight text-base text-white/80
  placeholder:text-white/30
  focus:border-foreground transition-colors duration-300
`;

export default function RecommendPage() {
  const router = useRouter();
  const [invite, setInvite] = useState<Invite>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Recommend Friends · Tminus0";
    const stored = sessionStorage.getItem("t0_invite_response") as Invite;
    if (stored !== "accept" && stored !== "decline") {
      router.replace("/invite");
      return;
    }
    setInvite(stored);
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!invite) return;

    const formData = new FormData(e.currentTarget);
    formData.set("response", invite);
    formData.set("referralId", sessionStorage.getItem("t0_referral_id") || "");

    setStatus("loading");
    const result = await submitInvite(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setStatus("error");
      return;
    }

    setStatus("success");
    sessionStorage.removeItem("t0_invite_response");
    sessionStorage.removeItem("t0_invite_opened");
    sessionStorage.removeItem("t0_referral_id");
    (e.target as HTMLFormElement).reset();

    if (invite === "accept" && GROUPME_INVITE_URL) {
      window.open(GROUPME_INVITE_URL, "_blank", "noopener,noreferrer");
    }
  }

  if (!invite) return null;

  return (
    <main className="relative min-h-screen bg-background overflow-y-auto overflow-x-hidden">
      <MouseSphere />
      <FolderWatermark label="Confidential" opacity={0.02} />

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <div className="relative z-[1] min-h-screen flex items-center justify-center px-5 sm:px-6 md:px-10 py-10 sm:py-16 md:py-24">
        <div className="w-full max-w-xl">
          <Link
            href="/invite"
            className="group relative inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.4em] text-white/40 pb-1 mb-6 sm:mb-8 transition-colors duration-300 hover:text-white/80"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back</span>
          </Link>

          <div className="text-center flex flex-col items-center">
            <p className="font-mono text-[10px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-3 opacity-80">
              FILE: REFERRALS · CLEARANCE: PERSONAL
            </p>
            <h1 className="font-timer font-extralight text-2xl sm:text-3xl md:text-4xl text-white/92 leading-snug mb-4">
              Recommend 3 people.
            </h1>
            <p className="font-timer font-light text-sm sm:text-base md:text-lg text-white/70 leading-relaxed mb-2 max-w-md">
              Whether you&apos;re in or not — who else do you think would be
              into a startup challenge like this?
            </p>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 mb-8 sm:mb-10 md:mb-14">
              Optional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
                <input
                  name={`referral${n}First`}
                  type="text"
                  placeholder={`Friend ${n} — first name`}
                  className={fieldClass}
                />
                <input
                  name={`referral${n}Last`}
                  type="text"
                  placeholder={`Friend ${n} — last name`}
                  className={fieldClass}
                />
              </div>
            ))}

            <div className="flex flex-col items-center gap-4 pt-3">
              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  group relative inline-flex items-center gap-2 max-w-full px-2 text-center
                  font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.25em] sm:tracking-[0.45em] text-foreground
                  pb-1 transition-colors duration-300 hover:text-white
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
              >
                <span className="whitespace-normal">
                  {status === "loading"
                    ? "Sending"
                    : invite === "accept"
                      ? "Submit and join GroupMe"
                      : "Submit"}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                <span className="absolute left-0 -bottom-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </button>

              {status === "success" && (
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-foreground/70">
                  ✓ Thanks for the recommendations
                </span>
              )}
              {status === "error" && (
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-red-400/80">
                  ✗ {errorMsg}
                </span>
              )}
            </div>
          </form>

          <div className="mt-8 sm:mt-10 pt-3 border-t border-white/10 font-mono text-[9px] text-white/25 tracking-[0.35em] uppercase text-center">
            INVITE RESPONSE · T-0 · CLEARANCE: PERSONAL
          </div>
        </div>
      </div>
    </main>
  );
}
