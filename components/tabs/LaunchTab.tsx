"use client";

import Image from "next/image";
import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";
import GlitchReveal from "@/components/GlitchReveal";

/** ms after the slide arrives that the date glitches in, behind the title. */
const DATE_DELAY = 1000;

export default function LaunchTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Launch" index={3} color="bg-background" tab={3} totalTabs={totalTabs}>
      <MouseSphere />
      <Image
        src="/assets/thepitch.webp"
        alt=""
        fill
        priority={false}
        className="object-cover pointer-events-none select-none"
        style={{ opacity: 0.09 }}
      />
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 text-center relative z-10">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <Image
              src="/assets/logo.png"
              alt="T-0"
              width={256}
              height={256}
              className="h-40 md:h-64 w-auto select-none"
              style={{ mixBlendMode: "screen", opacity: 0.9 }}
            />
            <GlitchReveal
              text="LAUNCH"
              sectionIndex={3}
              duration={900}
              className="font-timer font-light text-6xl md:text-9xl tracking-[0.04em] leading-none"
              style={{ color: "#f0f4f8" }}
            />
          </div>

          <GlitchReveal
            text="September 13th, 2026"
            sectionIndex={3}
            delay={DATE_DELAY}
            duration={800}
            className="font-timer font-light text-2xl md:text-4xl tracking-[0.14em] leading-none"
            style={{ color: "#f0f4f8" }}
          />

          <p className="font-timer font-light text-xl md:text-3xl text-white/55 tracking-[0.04em]">
            Presented by BuildHouse
          </p>
        </div>

        <Image
          src="/assets/buildhouse-logo-transparent.png"
          alt="BuildHouse"
          width={195}
          height={140}
          className="h-20 md:h-28 w-auto object-contain"
        />
      </div>
    </FolderSection>
  );
}
