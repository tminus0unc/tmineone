"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import LogoBoard from "@/components/LogoBoard";

/**
 * Shows who is already sponsoring. Distinct from SponsorTab ("Sponsor"), which
 * is the pitch page for becoming one.
 */
export default function SponsorLogosTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Sponsors" index={5} color="bg-background" tab={5} totalTabs={totalTabs}>
      <MouseSphere />
      <LogoBoard
        sectionIndex={5}
        title="Sponsors"
        items={[
          {
            // Transparent variant — reads far better than the white-background one on a dark card.
            src: "/assets/buildhouse-logo-transparent.png",
            alt: "BuildHouse",
            label: "BuildHouse",
            width: 860,
            height: 618,
            wide: true,
          },
          {
            src: "/assets/base44logo.png",
            alt: "Base44",
            label: "Base44",
            width: 600,
            height: 600,
          },
        ]}
      />
    </FolderSection>
  );
}
