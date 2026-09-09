"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import Timer from "@/components/Timer";
import ScrollDownButton from "@/components/Scroller";
import IntroReveal from "@/components/IntroReveal";

export default function CountdownTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Countdown" index={1} color="bg-background" tab={1} totalTabs={totalTabs}>
      <MouseSphere />
      <Timer />

      {/* Dims the globe as the countdown dissolves, so the intro copy reads over it. */}
      <div
        className="intro-scrim absolute inset-0 z-[15] pointer-events-none"
        // Starts clear; IntroReveal raises it as the countdown dissolves.
        style={{ background: "var(--background)", opacity: 0 }}
      />

      {/* The About copy lives here, not in its own tab: the globe has to stay
          put underneath it while it reveals. */}
      <IntroReveal
        sectionIndex={1}
        headline="Ideas are everywhere."
        paragraphs={[
          { text: "Classroom conversations. Group chats. Late-night talks. The hard part: execution. People plan more than act and brainstorm more than build." },
          { text: "T-0 is a startup-inspired challenge created to fix this execution gap. Participants are dropped into an unexpected challenge and given limited time to respond, adapt, and execute." },
          { text: "The challenge isn't revealed until start time.", accent: true },
          { text: "At its core, T-0 is about cultivating a culture of creativity, problem-solving, and execution and giving students a space to practice all three." },
          { text: "Ready at T-minus zero." },
        ]}
      />

      <div className="intro-fade">
        <ScrollDownButton targetId="About" />
      </div>
    </FolderSection>
  );
}
