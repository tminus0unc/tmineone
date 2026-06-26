"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import FolderWatermark from "@/components/FolderWatermark";
import AppForm from "@/components/AppForm";
import ScrollDownButton from "@/components/Scroller";

export default function JoinTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Join" index={5} color="bg-background" tab={5} totalTabs={totalTabs}>
      <MouseSphere />
      <FolderWatermark label={" Confidential"} />
      <AppForm />
      <ScrollDownButton targetId="Team" />
    </FolderSection>
  );
}
