"use client";

import dynamic from "next/dynamic";
import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import ScrollDownButton from "@/components/Scroller";

const MapEmbed = dynamic(() => import("@/components/MapEmbeded"), { ssr: false });

export default function LocationTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Location" index={8} color="bg-background" tab={8} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-row gap-0 min-h-0">
        <div className="w-3/4 overflow-hidden min-h-0">
          <MapEmbed />
        </div>
        <div className="w-1/4 flex flex-col justify-center gap-5 px-5 md:px-8 border-l border-foreground/10">
          <p className="font-timer font-light text-sm md:text-base text-white/70 leading-relaxed">
            <span className="font-mono text-foreground mr-1.5 text-base md:text-lg">*</span>
The PITCH, an event venue on Franklin Street in the heart of Chapel Hill, will serve as our home for T-0.
          </p>
          <ScrollDownButton targetId="Team" />
        </div>
      </div>
    </FolderSection>
  );
}
