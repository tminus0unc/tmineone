"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

export default function LaunchTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Launch" index={3} color="bg-background" tab={3} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 text-center">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <img
              src="/icon.svg"
              alt="T-0"
              className="h-40 md:h-64 w-auto select-none"
              style={{ mixBlendMode: "screen", opacity: 0.9 }}
            />
            <span
              className="font-timer font-light text-6xl md:text-9xl tracking-[0.04em] leading-none"
              style={{ color: "#f0f4f8" }}
            >
              LAUNCH
            </span>
          </div>
          <p className="font-timer font-light text-xl md:text-3xl text-white/55 tracking-[0.04em]">
            Presented by BuildHouse
          </p>
        </div>

        <img
          src="/assets/buildhouse-logo-transparent.png"
          alt="BuildHouse"
          className="h-20 md:h-28 w-auto object-contain"
        />
      </div>
    </FolderSection>
  );
}
