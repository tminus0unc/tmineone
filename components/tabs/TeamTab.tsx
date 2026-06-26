"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";
import TeamCards from "@/components/TeamCards";

export default function TeamTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Team" index={6} color="bg-background" tab={6} totalTabs={totalTabs}>
      <MouseSphere />
      <FolderWatermark label={" Confidential"} opacity={0.025} />
      <TeamCards />
    </FolderSection>
  );
}
