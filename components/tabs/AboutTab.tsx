"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="About" index={2} color="bg-background" tab={2} totalTabs={totalTabs}>
      <MouseSphere />
      <FolderWatermark label={" Confidential"} opacity={0.02} />

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 28%, rgba(0,100,220,0.09) 55%, rgba(0,85,200,0.22) 76%, rgba(0,70,185,0.34) 100%)",
        }}
      />

      <div className="flex-1 flex items-center justify-center px-10 md:px-20 py-6 min-h-0">
        <div className="w-full max-w-3xl">
          <ScrollReveal
            sectionIndex={1}
            paragraphs={[
              { text: "Ideas are everywhere.", heading: true },
              { text: "Classroom conversations. Group chats. Late-night talks. The hard part: execution. People plan more than act and brainstorm more than build." },
              { text: "T-0 is a startup-inspired challenge created to fix this execution gap. Participants are dropped into an unexpected challenge and given limited time to respond, adapt, and execute." },
              { text: "The challenge isn't revealed until start time.", accent: true },
              { text: "At its core, T-0 is about cultivating a culture of creativity, problem-solving, and execution and giving students a space to practice all three." },
              { text: "Ready at T-minus zero." },
            ]}
          />
        </div>
      </div>
    </FolderSection>
  );
}
