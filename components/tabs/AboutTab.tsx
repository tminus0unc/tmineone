"use client";

import FolderSection from "@/components/FolderSection";

/**
 * Deliberately empty. The About copy is rendered by IntroReveal inside the
 * Countdown section so the globe stays fixed behind it; this section only
 * supplies the scroll length its reveal is pinned to, plus its tab.
 */
export default function AboutTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection
      title="About"
      index={2}
      color="bg-background"
      tab={2}
      totalTabs={totalTabs}
      transparent
    />
  );
}
