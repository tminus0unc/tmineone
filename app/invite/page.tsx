"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";
import Envelope from "@/components/Envelope";
import { getReferralAccess } from "@/app/actions/addReferral";

type Invite = "accept" | "decline" | null;
type Access = "checking" | "invalid" | "accepted" | "declined" | "ok";

function InvitePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invite, setInvite] = useState<Invite>(null);
  const [opened, setOpened] = useState(false);
  const [envelopeMounted, setEnvelopeMounted] = useState(true);
  const [justOpened, setJustOpened] = useState(false);
  const [ready, setReady] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [access, setAccess] = useState<Access>("checking");

  useEffect(() => {
    document.title = "You're Invited · Tminus0";

    const ref = searchParams.get("ref");

    if (!ref) {
      setAccess("invalid");
      setReady(true);
      return;
    }

    getReferralAccess(ref).then((result) => {
      if (!result.valid) {
        setAccess("invalid");
        setReady(true);
        return;
      }

      if (result.alreadyResponded) {
        setAccess(result.status === "accepted" ? "accepted" : "declined");
        setReady(true);
        return;
      }

      sessionStorage.setItem("t0_referral_id", ref);

      if (sessionStorage.getItem("t0_invite_opened") === "true") {
        setOpened(true);
        setEnvelopeMounted(false);
      }
      const stored = sessionStorage.getItem("t0_invite_response") as Invite;
      if (stored === "accept" || stored === "decline") setInvite(stored);

      setAccess("ok");
      setReady(true);
    });
  }, [searchParams]);

  function handleOpening() {
    setOpened(true);
    setJustOpened(true);
    sessionStorage.setItem("t0_invite_opened", "true");
  }

  function handleOpenComplete() {
    setEnvelopeMounted(false);
  }

  function handleSelect(choice: "accept" | "decline") {
    setInvite(choice);
    setNavigating(true);
    sessionStorage.setItem("t0_invite_response", choice);
    setTimeout(() => router.push("/invite/recommend"), 300);
  }

  if (!ready) return null;

  if (access !== "ok") {
    const messages: Record<Exclude<Access, "ok" | "checking">, { title: string; body: string }> = {
      invalid: {
        title: "This invite link isn't valid.",
        body: "Double-check the link you were sent, or reach out to whoever invited you.",
      },
      accepted: {
        title: "You've already accepted this invite.",
        body: "See you at T-0!",
      },
      declined: {
        title: "You've already responded to this invite.",
        body: "Changed your mind? You can still sign up directly from the homepage.",
      },
    };
    const { title, body } = messages[access as Exclude<Access, "ok" | "checking">];

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
        <div className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 md:px-10 py-10 sm:py-16 md:py-24 text-center">
          <p className="font-mono text-[10px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-6 sm:mb-8 opacity-80">
            FILE: INVITE · CLEARANCE: PERSONAL
          </p>
          <h1 className="font-timer font-extralight text-2xl sm:text-3xl md:text-4xl text-white/92 leading-snug mb-4 max-w-lg">
            {title}
          </h1>
          <p className="font-timer font-light text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-md">
            {body}
          </p>
          {access === "declined" && (
            <Link
              href="/#Join"
              className="group relative inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.45em] text-foreground pb-1 transition-colors duration-300 hover:text-white"
            >
              <span>Sign up</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
              <span className="absolute left-0 -bottom-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background overflow-y-auto overflow-x-hidden">
      <MouseSphere />
      <FolderWatermark label="Confidential" opacity={0.02} />

      {/* Subtle depth vignette, matching the other sections */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <div className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 md:px-10 py-10 sm:py-16 md:py-24">
        <p className="font-mono text-[10px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-6 sm:mb-8 opacity-80 text-center">
          FILE: INVITE · CLEARANCE: PERSONAL
        </p>
        <div className="grid w-full justify-items-center" style={{ gridTemplateAreas: '"stack"' }}>
        {envelopeMounted && (
          <div style={{ gridArea: "stack" }} className="w-full max-w-sm text-center">
            <Envelope onOpening={handleOpening} onOpen={handleOpenComplete} />
          </div>
        )}
        {opened && (
          <div
            style={{
              gridArea: "stack",
              ...(justOpened && {
                animation: "contentReveal 550ms cubic-bezier(0.22, 1, 0.36, 1) 560ms both",
              }),
            }}
            className="w-full max-w-xl text-center"
          >
            <h1 className="font-timer font-extralight text-2xl sm:text-3xl md:text-4xl text-white/92 leading-snug mb-6 sm:mb-8">
              Someone thought you&apos;d enjoy T-0.
            </h1>

            {/* Blurb + learn more */}
            <div className="mb-8 sm:mb-10 md:mb-14 flex flex-col items-center">
              <p className="font-timer font-light text-sm sm:text-base md:text-lg text-white/70 leading-relaxed mb-4 max-w-md">
                T-0 is a startup-inspired challenge for people who&apos;d
                rather build than talk. The challenge stays a secret until
                T-minus zero.
              </p>
              <Link
                href="/#About"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.45em] text-foreground pb-1 transition-colors duration-300 hover:text-white"
              >
                <span>Learn more</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                <span className="absolute left-0 -bottom-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>

            {/* Accept / Decline */}
            <div className="mb-8 sm:mb-10 md:mb-14 flex flex-col items-center">
              <p className="font-mono text-[10px] text-foreground/80 tracking-[0.4em] uppercase mb-4">
                Will you join?
              </p>
              <div className="flex gap-4 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => handleSelect("accept")}
                  disabled={navigating}
                  className={`flex-1 border font-mono text-[12px] uppercase tracking-[0.35em] py-3 transition-colors duration-300 disabled:cursor-not-allowed ${
                    invite === "accept"
                      ? "border-foreground text-foreground bg-foreground/10"
                      : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                  }`}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect("decline")}
                  disabled={navigating}
                  className={`flex-1 border font-mono text-[12px] uppercase tracking-[0.35em] py-3 transition-colors duration-300 disabled:cursor-not-allowed ${
                    invite === "decline"
                      ? "border-foreground text-foreground bg-foreground/10"
                      : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                  }`}
                >
                  Decline
                </button>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-3 border-t border-white/10 font-mono text-[9px] text-white/25 tracking-[0.35em] uppercase">
              INVITE RESPONSE · T-0 · CLEARANCE: PERSONAL
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={null}>
      <InvitePageInner />
    </Suspense>
  );
}
