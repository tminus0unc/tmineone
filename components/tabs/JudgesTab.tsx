"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

export default function JudgesTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Judges" index={4} color="bg-background" tab={4} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-row min-h-0">

        {/* Left half — Judges */}
        <div className="flex-1 flex flex-col justify-center gap-8 px-8 md:px-14 py-8 border-r border-foreground/15">
          <div>
            <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase mb-4">
              JUDGES
            </p>
            <p className="font-timer font-light text-xl md:text-2xl text-white/75 leading-relaxed">
              We have a panel of startup founders joining us as judges.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <img
                src="/assets/forbes.png"
                alt="Forbes 30 Under 30"
                className="h-14 md:h-16 w-auto object-contain object-left"
              />
              <p className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[0.3em] uppercase">
                Forbes 30 Under 30
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <img
                src="/assets/residency.png"
                alt="The Residency — San Francisco"
                className="h-12 md:h-14 w-auto object-contain object-left"
              />
              <p className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[0.3em] uppercase">
                The Residency — San Francisco
              </p>
            </div>
          </div>
        </div>

        {/* Right half — Sponsors */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-8">
          <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase mb-5">
            SPONSORS
          </p>
          <p
            className="font-timer font-light text-4xl md:text-5xl tracking-[0.06em]"
            style={{ color: "rgba(240,244,248,0.55)" }}
          >
            Coming soon.
          </p>
        </div>

      </div>
    </FolderSection>
  );
}
