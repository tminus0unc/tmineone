"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

export default function ChallengeTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Challenge" index={3} color="bg-background" tab={3} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex items-center justify-center">
        <p
          className="font-timer font-light text-4xl md:text-6xl tracking-[0.1em]"
          style={{ color: "rgba(240,244,248,0.65)" }}
        >
          Coming soon.
        </p>
      </div>
    </FolderSection>
  );
}
