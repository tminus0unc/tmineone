"use client";

import Link from "next/link";
import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

export default function ChallengeTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Challenge" index={7} color="bg-background" tab={7} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto px-8 py-8">
        <div className="flex flex-col gap-6 max-w-xl w-full">
          <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase">
            INVITATION
          </p>

          <div className="flex flex-col gap-3 pt-1">
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
      </div>
    </FolderSection>
  );
}
