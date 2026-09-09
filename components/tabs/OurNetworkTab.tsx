"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import LogoBoard from "@/components/LogoBoard";

export default function OurNetworkTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Our Network" index={4} color="bg-background" tab={4} totalTabs={totalTabs}>
      <MouseSphere />
      <LogoBoard
        sectionIndex={4}
        title="Our Network"
        items={[
          {
            src: "/assets/forbes.png",
            alt: "Forbes 30 Under 30",
            label: "Forbes 30 Under 30",
            width: 447,
            height: 447,
          },
          {
            src: "/assets/residency2.png",
            alt: "The Residency — San Francisco",
            label: "The Residency — San Francisco",
            width: 1240,
            height: 1240,
          },
          {
            src: "/assets/yc.png",
            alt: "Y Combinator",
            label: "Y Combinator",
            width: 510,
            height: 508,
          },
        ]}
      />
    </FolderSection>
  );
}
