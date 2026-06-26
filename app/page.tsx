"use client";

import Timer from "@/components/Timer";
import "./globals.css";
import React, {useEffect} from "react";
import FolderSection from "@/components/FolderSection";
import ScrollDownButton from "@/components/Scroller";
import FolderWatermark from "@/components/FolderWatermark";
import AppForm from "@/components/AppForm";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
import Image from "next/image";
import MouseSphere from "@/components/MouseSphere";
import TeamCards from "@/components/TeamCards";
import FlipBook from "@/components/Flipbook";
import ScrollReveal from "@/components/ScrollReveal";


const MapEmbed = dynamic(() => import("@/components/MapEmbeded"), {
  ssr: false,
});

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Home() {
  useEffect(() => {
    document.title = "Tminus0";
  }, []);
  return (
    <>
      <main className="bg-background h-screen overflow-y-scroll">
        <FolderSection
          title="Countdown"
          index={1}
          color="bg-background"
          tab={1}
        >
          <MouseSphere />
          <Timer />
          <ScrollDownButton targetId={"About"} />
        </FolderSection>

        <FolderSection title="About" index={2} color="bg-background" tab={2}>
          <MouseSphere />
          <FolderWatermark label={" Confidential"} opacity={0.02} />

          <div className="flex-1 flex items-center justify-center px-10 md:px-20 py-6 min-h-0">
            <div className="w-full max-w-3xl">
              <ScrollReveal
                sectionIndex={1}
                paragraphs={[
                  { text: "Ideas are everywhere." },
                  { text: "Classroom conversations. Group chats. Late-night talks. The hard part: execution. People plan more than act, and brainstorm more than build." },
                  { text: "T-0 is a startup-inspired challenge created to fix this. Participants are dropped into an unexpected challenge and given limited time to respond, adapt, and execute." },
                  { text: "The challenge isn't revealed until start time.", accent: true },
                  { text: "At its core, T-0 is about cultivating a culture of creativity, problem-solving, and execution, and giving students a space to practice all three." },
                  { text: "Ready at T-minus zero." },
                ]}
              />
            </div>
          </div>
        </FolderSection>

        <FolderSection
          title="Join"
          index={3}
          color="bg-background"
          tab={3}
        >
          <MouseSphere />
          <FolderWatermark label={" Confidential"} />
          <AppForm />
          <ScrollDownButton targetId={"Team"} />
        </FolderSection>

        <FolderSection title="Team" index={4} color="bg-background" tab={4}>
          <MouseSphere />
          <FolderWatermark label={" Confidential"} opacity={0.025} />
          <TeamCards />
        </FolderSection>

        <FolderSection title="Sponsor" index={5} color="bg-background" tab={5}>
          <MouseSphere />
          <FolderWatermark label="Sponsor" opacity={0.025} />

          <div className="flex-1 flex flex-col px-4 md:px-12 py-3 md:py-6 gap-3 md:gap-6 overflow-y-auto">
            {/* Header */}
            <div className="flex-shrink-0">
              <p className="font-mono text-[9px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-2 opacity-80">
                FILE: SPONSORSHIP · CLEARANCE: PUBLIC
              </p>
              <h2 className="font-timer font-light text-xl md:text-4xl leading-snug" style={{ color: "#f0f4f8" }}>
                Join us in supporting Carolina's emerging innovators.
              </h2>
            </div>

            {/* Flipbook + Sidebar */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
              {/* Flipbook */}
              <div
                className="border border-foreground/20 overflow-hidden relative flex items-center justify-center min-h-[280px] md:flex-1 md:min-h-0"
                style={{ paddingBottom: "24px" }}
              >
                <p className="font-mono text-[8px] md:text-[10px] text-foreground/30 tracking-[0.35em] uppercase absolute top-2 left-3 z-10">
                  SPONSORSHIP PACKAGE
                </p>
                <FlipBook />
              </div>

              {/* Sidebar */}
              <div className="flex-shrink-0 md:w-64 flex flex-col gap-3">
                {/* Overview */}
                <div>
                  <p className="font-mono text-[9px] md:text-[11px] text-foreground/50 tracking-[0.4em] uppercase mb-1.5">
                    OVERVIEW
                  </p>
                  <p className="font-timer font-light text-sm md:text-base text-white/70 leading-relaxed">
                    We're seeking sponsors who value initiative, creativity, and
                    execution — and want to empower the next generation of
                    founders, builders, and problem-solvers.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-foreground/15" />

                {/* Status + Emails */}
                <div className="flex flex-col gap-2 pb-6 md:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/50 animate-pulse flex-shrink-0" />
                    <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-foreground/35">
                      STATUS: OPEN
                    </span>
                  </div>
                  <a
                    href="mailto:tminus0.unc@gmail.com"
                    className="font-mono text-[9px] md:text-[11px] text-foreground/60 tracking-[0.15em] uppercase border border-foreground/20 px-3 py-2 transition-all duration-300 hover:border-foreground/60 hover:text-white hover:bg-foreground/5"
                  >
                    tminus0.unc@gmail.com
                  </a>
                  <a
                    href="mailto:amelish@unc.edu"
                    className="font-mono text-[9px] md:text-[11px] text-foreground/60 tracking-[0.15em] uppercase border border-foreground/20 px-3 py-2 transition-all duration-300 hover:border-foreground/60 hover:text-white hover:bg-foreground/5"
                  >
                    amelish@unc.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FolderSection>

        <FolderSection title="Location" index={6} color="bg-background" tab={6}>
          <MouseSphere />
          <div className="flex-1 flex flex-col gap-6 py-8 min-h-0">
            <div className="flex-1 overflow-hidden m-2.5 min-h-0">
              <MapEmbed />
            </div>
            <div className="pb-8 flex justify-center">
              <ScrollDownButton targetId={"Community"} />
            </div>
          </div>
        </FolderSection>

        <FolderSection title="Community" index={7} color="bg-background" tab={7}>
          <div className="relative flex-1 -mx-4 md:-mx-10 overflow-hidden">
            {/* Team photo, full bleed, kept at natural framing */}
            <img
              src="/assets/t-0%20team%20photo.JPG"
              alt="The T-0 team"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.7) contrast(1.05) saturate(0.82)" }}
            />

            {/* Top scrim so the headline reads without obstructing faces */}
            <div
              className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(12,17,21,0.94) 0%, rgba(12,17,21,0.55) 45%, transparent 100%)",
              }}
            />
            {/* Subtle bottom scrim for depth */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(12,17,21,0.6), transparent)",
              }}
            />

            {/* Headline */}
            <div className="absolute inset-x-0 top-0 px-8 md:px-20 pt-10 md:pt-16">
              <p className="font-mono text-[10px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-4 opacity-80">
                T-MINUS ZERO · CHAPEL HILL
              </p>
              <h2
                className="font-timer font-light text-3xl md:text-5xl leading-[1.15] max-w-3xl"
                style={{ color: "#f0f4f8" }}
              >
                Join us at UNC's most ambitious startup community.
              </h2>
            </div>
          </div>
        </FolderSection>
      </main>
      <Analytics />
    </>
  );
}
