"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";
import FlipBook from "@/components/Flipbook";

export default function SponsorTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Sponsor" index={7} color="bg-background" tab={7} totalTabs={totalTabs}>
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
          <div
            className="border border-foreground/20 overflow-hidden relative flex items-center justify-center min-h-[200px] md:w-[42%] md:min-h-0 flex-shrink-0"
            style={{ paddingBottom: "20px" }}
          >
            <p className="font-mono text-[8px] md:text-[10px] text-foreground/30 tracking-[0.35em] uppercase absolute top-2 left-3 z-10">
              SPONSORSHIP PACKAGE
            </p>
            <FlipBook />
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
              <a href="mailto:amelish@unc.edu" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
                amelish@unc.edu
              </a>{" "}
              if interested.
            </p>
          </div>
        </div>
      </div>
    </FolderSection>
  );
}
