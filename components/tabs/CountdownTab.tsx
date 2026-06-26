"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import Timer from "@/components/Timer";
import ScrollDownButton from "@/components/Scroller";

export default function CountdownTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Countdown" index={1} color="bg-background" tab={1} totalTabs={totalTabs}>
      <MouseSphere />
      <Timer />
      <ScrollDownButton targetId="About" />
    </FolderSection>
  );
}
