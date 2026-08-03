"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";

export default function SponsorTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Sponsor" index={6} color="bg-background" tab={6} totalTabs={totalTabs}>
      <MouseSphere />
      <FolderWatermark label="Sponsor" opacity={0.025} />

      <div className="flex-1 flex flex-col px-4 md:px-12 py-3 md:py-6 gap-3 md:gap-6 overflow-hidden">
        <div className="flex-shrink-0">
          <p className="font-mono text-[9px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-2 opacity-80">
            FILE: SPONSORSHIP · CLEARANCE: PUBLIC
          </p>
          <h2 className="font-timer font-light text-xl md:text-4xl leading-snug" style={{ color: "#f0f4f8" }}>
            Join us in supporting Carolina&apos;s emerging innovators.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-8 flex-1 min-h-0">
          <div className="border border-foreground/20 overflow-hidden flex flex-col min-h-[300px] md:w-[42%] md:min-h-0 flex-shrink-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-foreground/20 flex-shrink-0">
              <p className="font-mono text-[8px] md:text-[10px] text-foreground/40 tracking-[0.35em] uppercase">
                SPONSORSHIP PACKAGE
              </p>
              <a
                href="/assets/sponsorship-guide.pdf"
                download
                className="font-mono text-[8px] md:text-[10px] text-foreground/70 hover:text-foreground tracking-[0.3em] uppercase transition-colors duration-200"
              >
                Download ↓
              </a>
            </div>
            <iframe
              src="/assets/sponsorship-guide.pdf#view=FitH"
              title="Sponsorship Package"
              className="w-full flex-1 min-h-0 bg-white"
            />
          </div>

          <div className="md:w-1/2 flex flex-col justify-center gap-6">
            <div>
              <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.4em] uppercase mb-3">
                OVERVIEW
              </p>
              <p className="font-timer font-light text-xl md:text-2xl text-white/75 leading-relaxed">
                We&apos;re seeking sponsors who value initiative, creativity, and
                execution — and want to empower the next generation of
                founders, builders, and problem-solvers.
              </p>
            </div>

            <div className="w-full h-px bg-foreground/15" />

            <p className="font-timer font-light text-base md:text-lg text-white/65 leading-relaxed">
              Please reach out to{" "}
              <a href="mailto:tminus0.unc@gmail.com" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
                tminus0.unc@gmail.com
              </a>{" "}
              or{" "}
              <a href="mailto:ygadi@unc.edu" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
                ygadi@unc.edu
              </a>{" "}
              if interested.
            </p>
          </div>
        </div>
      </div>
    </FolderSection>
  );
}
