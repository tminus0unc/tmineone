"use client";

import { useEffect } from "react";
import Link from "next/link";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";
import IntroForm from "@/components/IntroForm";

export default function IntroducePage() {
  useEffect(() => {
    document.title = "Introduce Yourself · T-0";
  }, []);

  return (
    <main className="relative bg-background h-screen overflow-y-auto flex flex-col">
      <MouseSphere />
      <FolderWatermark label={" Confidential"} />

      <div className="relative z-[1] px-4 md:px-10 flex-1 flex flex-col min-h-0">
        <div className="pt-8 md:pt-10">
          <Link
            href="/#Challenge"
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40 hover:text-white/75 transition-colors duration-300"
          >
            ← Back
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-8">
          <div className="w-full max-w-xl">

            <div className="mb-10 md:mb-14">
              <p className="font-mono text-[11px] text-foreground tracking-[0.45em] uppercase mb-3 opacity-80">
                FILE: INTRODUCE_YOURSELF.T-0
              </p>
              <h2 className="font-timer font-extralight text-3xl md:text-4xl text-white/92 leading-snug">
                Tell us who you are.
              </h2>
            </div>

            <IntroForm />

            <div className="mt-7 pt-3 border-t border-white/10 font-mono text-[9px] text-white/25 tracking-[0.35em] uppercase">
              INTRODUCTION · T-0 · CLEARANCE: OPEN
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
