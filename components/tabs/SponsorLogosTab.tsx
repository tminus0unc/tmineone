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
        groups={[
          {
            title: "Sponsors & Partners",
            bare: true,
            rows: [
              [
                {
                  // Cropped tight to the mark — no baked-in padding to throw off height matching.
                  src: "/assets/buildhouse-cropped.png",
                  alt: "BuildHouse",
                  label: "BuildHouse",
                  width: 837,
                  height: 611,
                  heightClass: "h-28 sm:h-32 md:h-44",
                },
                {
                  src: "/assets/base44-cropped.png",
                  alt: "Base44",
                  label: "Base44",
                  width: 2520,
                  height: 530,
                  heightClass: "h-14 sm:h-16 md:h-20",
                },
              ],
              [
                {
                  src: "/assets/google-cropped.png",
                  alt: "Google",
                  label: "Google",
                  width: 2998,
                  height: 1138,
                  heightClass: "h-9 sm:h-10 md:h-14",
                },
                {
                  src: "/assets/doordash-cropped.png",
                  alt: "DoorDash",
                  label: "DoorDash",
                  width: 3840,
                  height: 742,
                  heightClass: "h-8 sm:h-9 md:h-12",
                },
              ],
            ],
          },
        ]}
      />
    </FolderSection>
  );
}
