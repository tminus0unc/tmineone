"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";

export default function SponsorTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Sponsor" index={7} color="bg-background" tab={7} totalTabs={totalTabs}>
      <MouseSphere />
      <FolderWatermark label="Sponsor" opacity={0.025} />

      <div className="flex-1 flex flex-col px-4 md:px-12 py-3 md:py-6 gap-3 md:gap-6 overflow-hidden">
        <div className="flex-shrink-0 pt-8 md:pt-12">
          <p className="font-mono text-[9px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-2 opacity-80">
            FILE: SPONSORSHIP · CLEARANCE: PUBLIC
          </p>
          <h2 className="font-timer font-light text-xl md:text-4xl leading-snug" style={{ color: "#f0f4f8" }}>
            Join us in supporting Carolina&apos;s emerging innovators.
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6 max-w-2xl">
          <div>
            <p className="font-timer font-light text-xl md:text-2xl text-white/75 leading-relaxed">
              We&apos;re seeking sponsors who value initiative, creativity, and
              execution — and want to empower the next generation of
              founders, builders, and problem-solvers.
            </p>
          </div>

          <div>
            <a
              href="https://drive.google.com/file/d/1PhyX1cdftaq6L-eRgPLzRYX5TCQaES9G/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group relative inline-flex items-center gap-2.5
                border border-foreground text-foreground
                px-6 py-3 md:px-7 md:py-3.5
                font-mono text-[12px] md:text-[13px] uppercase tracking-[0.35em]
                transition-colors duration-300
                hover:bg-foreground hover:text-background
              "
            >
              <span>View Sponsorship Package</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="w-full h-px bg-foreground/15" />

          <p className="font-timer font-light text-base md:text-lg text-white/65 leading-relaxed">
            Please reach out to{" "}
            <a href="mailto:tminus0.unc@gmail.com" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
              tminus0.unc@gmail.com
            </a>{" "}
            or{" "}
            <a href="mailto:ishani.gandi@unc.edu" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
              ishani.gandi@unc.edu
            </a>{" "}
            if interested.
          </p>
        </div>
      </div>
    </FolderSection>
  );
}
