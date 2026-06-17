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
import { Metadata } from 'next';


const MapEmbed = dynamic(() => import("@/components/MapEmbeded"), {
  ssr: false,
});

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Home() {
  useEffect(() => {
    document.title = "T minus 0";
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
          <MouseSphere /> {/* add this */}
          <Timer className={"font-timer font-bold"} />
          <ScrollDownButton targetId={"About Us"} />
        </FolderSection>

        <FolderSection title="About Us" index={2} color="bg-background" tab={2}>
          <MouseSphere />
          <FolderWatermark label={" Confidential"} />

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="max-w-6xl w-full px-4 md:px-12 flex flex-row items-center gap-12">
              {/* Left: Image */}
              <div className="hidden md:flex flex-shrink-0 w-[35%] self-stretch relative min-h-[400px] rounded-sm overflow-hidden">
                {/* Subtle border */}
                <div className="absolute inset-0 border border-foreground/20 z-10 pointer-events-none rounded-sm" />

                {/* Dark gradient fade at bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-32 z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  }}
                />

                {/* Dark gradient fade at top */}
                <div
                  className="absolute inset-x-0 top-0 h-16 z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
                  }}
                />

                {/* Left edge fade to blend into background */}
                <div
                  className="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.4), transparent)",
                  }}
                />

                {/* Image */}
                <img
                  src="/assets/IMG_0746.jpeg"
                  alt="About T-0"
                  className="w-full h-full object-cover object-center"
                  style={{
                    filter: "brightness(0.8) contrast(1.05) saturate(0.85)",
                  }}
                />

                {/* Scan lines */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)",
                  }}
                />
              </div>

              {/* Right: Text */}
              <div className="text-left text-white flex-1 overflow-y-auto">
                <p className="text-foreground uppercase tracking-[0.4em] text-xs md:text-sm mb-4 md:mb-8">
                  What is T-0?
                </p>

                <div className="space-y-4 md:space-y-8 text-base md:text-xl leading-relaxed text-white/90">
                  <p className="text-3xl md:text-5xl font-bold text-white">
                    Ideas are everywhere.
                  </p>

                  <p>
                    Classroom conversations. Group chats. Late-night talks. The
                    hard part: execution. People plan more than act, and
                    brainstorm more than build.
                  </p>

                  <p>
                    T-0 is a startup-inspired challenge created to fix this.
                    Participants are dropped into an unexpected challenge and
                    given limited time to respond, adapt, and execute. The
                    catch?
                  </p>

                  <div className="flex items-center">
                    <div className="mr-4 h-6 md:h-8 w-px bg-foreground shadow-[0_0_10px_rgba(34,211,238,.8)]" />
                    <p className="text-xs uppercase tracking-[0.5em] text-foreground/80">
                      The challenge isn't revealed until start time.
                    </p>
                  </div>

                  <p className="hidden md:block">
                    At its core, T-0 is about cultivating a culture of
                    creativity, problem-solving, and execution, and giving
                    students a space to practice all three.
                  </p>

                  <p>Ready at T-minus zero.</p>

                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        document
                          .getElementById("Join Waitlist")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="
                border border-foreground/40 px-5 md:px-8 py-2 md:py-3
                text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] text-foreground
                transition-all duration-300 hover:border-foreground
                hover:bg-foreground/5 hover:text-white font-mono
              "
                    >
                      Stay in the Loop
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("Location")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="
                border border-foreground/40 px-5 md:px-8 py-2 md:py-3
                text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] text-foreground
                transition-all duration-300 hover:border-foreground
                hover:bg-foreground/5 hover:text-white font-mono
              "
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FolderSection>

        <FolderSection
          title="Join Waitlist"
          index={3}
          color="bg-[#0f0]"
          tab={3}
        >
          <MouseSphere />
          <FolderWatermark label={" Confidential"} />
          <div className="text-black text-2xl"></div>
          <AppForm />
          <ScrollDownButton targetId={"Location"} />
        </FolderSection>

        <FolderSection title="Location" index={4} color="bg-background" tab={4}>
          <MouseSphere />
          <div className="flex-1 flex flex-col gap-6 py-8 min-h-0">
            <div className="flex-1 overflow-hidden m-2.5 min-h-0">
              <MapEmbed />
            </div>
            <div className="pb-8 flex justify-center">
              <ScrollDownButton targetId={"Team"} />
            </div>
          </div>
        </FolderSection>

        <FolderSection title="Team" index={5} color="bg-[#00f]" tab={5}>
          <MouseSphere />
          <FolderWatermark label={" Confidential"} />
          <TeamCards />
        </FolderSection>

        <FolderSection title="Sponsor" index={6} color="bg-background" tab={6}>
          <MouseSphere />
          <FolderWatermark label="Sponsor" />

          <div className="flex-1 flex flex-col px-4 md:px-12 py-3 md:py-6 gap-3 md:gap-6 overflow-y-auto">
            {/* Header */}
            <div className="flex-shrink-0">
              <p className="font-mono text-[9px] md:text-[11px] text-foreground/40 tracking-[0.4em] uppercase mb-1">
                FILE: SPONSORSHIP · CLEARANCE: PUBLIC
              </p>
              <h2 className="text-xl md:text-4xl font-bold text-white leading-snug">
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
                  <p className="font-mono text-[9px] md:text-[11px] text-foreground/40 tracking-[0.4em] uppercase mb-1.5">
                    OVERVIEW
                  </p>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed">
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
      </main>
      <Analytics />
    </>
  );
}
