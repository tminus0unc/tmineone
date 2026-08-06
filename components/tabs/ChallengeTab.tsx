"use client";

import Link from "next/link";
import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

export default function ChallengeTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Challenge" index={4} color="bg-background" tab={4} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-row min-h-0">

        {/* Left — Invitation (larger) */}
        <div className="flex-[1.6] flex flex-col justify-start gap-6 px-8 md:px-14 pt-14 md:pt-16 pb-8 border-r border-foreground/15">
          <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase">
            INVITATION
          </p>

          <div className="flex flex-col gap-3 max-w-xl pt-1">
            <p className="font-timer font-light text-sm md:text-base text-white/70 leading-relaxed">
              Our first invitations are being sent to students whose work caught our attention or have been recommended by others in the community.
            </p>
            <p className="font-timer font-light text-sm md:text-base text-white/70 leading-relaxed">
              But we know we&apos;re far from discovering everyone. Some of the most interesting builders at UNC are people we haven&apos;t met yet.
            </p>
            <p className="font-timer font-light text-sm md:text-base text-white/70 leading-relaxed">
              If T-0 sounds like something you&apos;d want to be part of, we&apos;d love to hear from you.
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/introduce?from=Challenge"
              className="
                group relative inline-flex items-center gap-2.5
                border border-foreground text-foreground
                px-5 py-2.5 md:px-6 md:py-3
                font-mono text-[11px] md:text-[12px] uppercase tracking-[0.35em]
                transition-colors duration-300
                hover:bg-foreground hover:text-background
              "
            >
              <span>Introduce Yourself</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Right — Schedule (smaller) */}
        <div className="flex-[1] flex flex-col justify-center px-6 md:px-10 py-8">
          <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase mb-4">
            SCHEDULE
          </p>
          <p
            className="font-timer font-light text-2xl md:text-3xl tracking-[0.06em]"
            style={{ color: "rgba(240,244,248,0.55)" }}
          >
            Coming soon.
          </p>
        </div>

      </div>
    </FolderSection>
  );
}
