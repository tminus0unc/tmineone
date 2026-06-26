"use client";

import Timer from "@/components/Timer";
import "./globals.css";
import React, { useEffect } from "react";
import FolderSection from "@/components/FolderSection";
import ScrollDownButton from "@/components/Scroller";
import FolderWatermark from "@/components/FolderWatermark";
import AppForm from "@/components/AppForm";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
import MouseSphere from "@/components/MouseSphere";
import TeamCards from "@/components/TeamCards";
import FlipBook from "@/components/Flipbook";
import ScrollReveal from "@/components/ScrollReveal";

const MapEmbed = dynamic(() => import("@/components/MapEmbeded"), {
  ssr: false,
});

const TOTAL_TABS = 9;

export default function Home() {
  useEffect(() => {
    document.title = "Tminus0";
  }, []);

  return (
    <>
      <main className="bg-background h-screen overflow-y-scroll">
        {/* ── 1. Countdown ───────────────────────────────────────────── */}
        <FolderSection
          title="Countdown"
          index={1}
          color="bg-background"
          tab={1}
          totalTabs={TOTAL_TABS}
        >
          <MouseSphere />
          <Timer />
          <ScrollDownButton targetId={"About"} />
        </FolderSection>

        {/* ── 2. About ───────────────────────────────────────────────── */}
        <FolderSection title="About" index={2} color="bg-background" tab={2} totalTabs={TOTAL_TABS}>
          <MouseSphere />
          <FolderWatermark label={" Confidential"} opacity={0.02} />

          {/* Blue edge aura echoing the globe's atmospheric glow */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 28%, rgba(0,100,220,0.09) 55%, rgba(0,85,200,0.22) 76%, rgba(0,70,185,0.34) 100%)",
            }}
          />

          <div className="flex-1 flex items-center justify-center px-10 md:px-20 py-6 min-h-0">
            <div className="w-full max-w-3xl">
              <ScrollReveal
                sectionIndex={1}
                paragraphs={[
                  { text: "Ideas are everywhere.", heading: true },
                  { text: "Classroom conversations. Group chats. Late-night talks. The hard part: execution. People plan more than act and brainstorm more than build." },
                  { text: "T-0 is a startup-inspired challenge created to fix this execution gap. Participants are dropped into an unexpected challenge and given limited time to respond, adapt, and execute." },
                  { text: "The challenge isn't revealed until start time.", accent: true },
                  { text: "At its core, T-0 is about cultivating a culture of creativity, problem-solving, and execution and giving students a space to practice all three." },
                  { text: "Ready at T-minus zero." },
                ]}
              />
            </div>
          </div>
        </FolderSection>

        {/* ── 3. Challenge ───────────────────────────────────────────── */}
        <FolderSection title="Challenge" index={3} color="bg-background" tab={3} totalTabs={TOTAL_TABS}>
          <MouseSphere />
          <div className="flex-1 flex items-center justify-center">
            <p
              className="font-timer font-light text-4xl md:text-6xl tracking-[0.1em]"
              style={{ color: "rgba(240,244,248,0.65)" }}
            >
              Coming soon.
            </p>
          </div>
        </FolderSection>

        {/* ── 4. Judges ──────────────────────────────────────────────── */}
        <FolderSection title="Judges" index={4} color="bg-background" tab={4} totalTabs={TOTAL_TABS}>
          <MouseSphere />
          <div className="flex-1 flex flex-row min-h-0">

            {/* Left half — Judges */}
            <div className="flex-1 flex flex-col justify-center gap-8 px-8 md:px-14 py-8 border-r border-foreground/15">
              <div>
                <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase mb-4">
                  JUDGES
                </p>
                <p className="font-timer font-light text-xl md:text-2xl text-white/75 leading-relaxed">
                  We have a panel of startup founders joining us as judges.
                </p>
              </div>

              {/* Logos */}
              <div className="flex flex-col gap-8">
                {/* Forbes */}
                <div className="flex flex-col gap-2">
                  <img
                    src="/assets/forbes.png"
                    alt="Forbes 30 Under 30"
                    className="h-14 md:h-16 w-auto object-contain object-left"
                  />
                  <p className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[0.3em] uppercase">
                    Forbes 30 Under 30
                  </p>
                </div>

                {/* Residency */}
                <div className="flex flex-col gap-2">
                  <img
                    src="/assets/residency.png"
                    alt="The Residency — San Francisco"
                    className="h-12 md:h-14 w-auto object-contain object-left"
                  />
                  <p className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-[0.3em] uppercase">
                    The Residency — San Francisco
                  </p>
                </div>
              </div>
            </div>

            {/* Right half — Sponsors */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-8">
              <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.45em] uppercase mb-5">
                SPONSORS
              </p>
              <p
                className="font-timer font-light text-4xl md:text-5xl tracking-[0.06em]"
                style={{ color: "rgba(240,244,248,0.55)" }}
              >
                Coming soon.
              </p>
            </div>

          </div>
        </FolderSection>

        {/* ── 5. Join ────────────────────────────────────────────────── */}
        <FolderSection
          title="Join"
          index={5}
          color="bg-background"
          tab={5}
          totalTabs={TOTAL_TABS}
        >
          <MouseSphere />
          <FolderWatermark label={" Confidential"} />
          <AppForm />
          <ScrollDownButton targetId={"Team"} />
        </FolderSection>

        {/* ── 6. Team ────────────────────────────────────────────────── */}
        <FolderSection title="Team" index={6} color="bg-background" tab={6} totalTabs={TOTAL_TABS}>
          <MouseSphere />
          <FolderWatermark label={" Confidential"} opacity={0.025} />
          <TeamCards />
        </FolderSection>

        {/* ── 7. Sponsor ─────────────────────────────────────────────── */}
        <FolderSection title="Sponsor" index={7} color="bg-background" tab={7} totalTabs={TOTAL_TABS}>
          <MouseSphere />
          <FolderWatermark label="Sponsor" opacity={0.025} />

          <div className="flex-1 flex flex-col px-4 md:px-12 py-3 md:py-6 gap-3 md:gap-6 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0">
              <p className="font-mono text-[9px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-2 opacity-80">
                FILE: SPONSORSHIP · CLEARANCE: PUBLIC
              </p>
              <h2 className="font-timer font-light text-xl md:text-4xl leading-snug" style={{ color: "#f0f4f8" }}>
                Join us in supporting Carolina&apos;s emerging innovators.
              </h2>
            </div>

            {/* Flipbook + Right panel */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-8 flex-1 min-h-0">
              {/* Flipbook — smaller left side */}
              <div
                className="border border-foreground/20 overflow-hidden relative flex items-center justify-center min-h-[200px] md:w-[42%] md:min-h-0 flex-shrink-0"
                style={{ paddingBottom: "20px" }}
              >
                <p className="font-mono text-[8px] md:text-[10px] text-foreground/30 tracking-[0.35em] uppercase absolute top-2 left-3 z-10">
                  SPONSORSHIP PACKAGE
                </p>
                <FlipBook />
              </div>

              {/* Right panel — half the page, larger text */}
              <div className="md:w-1/2 flex flex-col justify-center gap-6">
                <div>
                  <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.4em] uppercase mb-3">
                    OVERVIEW
                  </p>
                  <p className="font-timer font-light text-xl md:text-2xl text-white/75 leading-relaxed">
                    We&apos;re seeking sponsors who value initiative, creativity, and
                    execution — and want to empower the next generation of
                    founders, builders, and problem-solvers.
                  </p>
                </div>

                <div className="w-full h-px bg-foreground/15" />

                <p className="font-timer font-light text-base md:text-lg text-white/65 leading-relaxed">
                  Please reach out to{" "}
                  <a href="mailto:tminus0.unc@gmail.com" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
                    tminus0.unc@gmail.com
                  </a>{" "}
                  or{" "}
                  <a href="mailto:amelish@unc.edu" className="text-foreground hover:text-foreground/80 transition-colors duration-200 underline underline-offset-2">
                    amelish@unc.edu
                  </a>{" "}
                  if interested.
                </p>
              </div>
            </div>
          </div>
        </FolderSection>

        {/* ── 8. Location ────────────────────────────────────────────── */}
        <FolderSection title="Location" index={8} color="bg-background" tab={8} totalTabs={TOTAL_TABS}>
          <MouseSphere />
          <div className="flex-1 flex flex-row gap-0 min-h-0">
            {/* Left 3/4: map */}
            <div className="w-3/4 overflow-hidden min-h-0">
              <MapEmbed />
            </div>
            {/* Right 1/4: inline asterisk + venue note */}
            <div className="w-1/4 flex flex-col justify-center gap-5 px-5 md:px-8 border-l border-foreground/10">
              <p className="font-timer font-light text-sm md:text-base text-white/70 leading-relaxed">
                <span className="font-mono text-foreground mr-1.5 text-base md:text-lg">*</span>
                Innovate Carolina, UNC-CH&apos;s entrepreneurship hub, is expected to serve as our venue. Pending final confirmation.
              </p>
              <ScrollDownButton targetId={"Community"} />
            </div>
          </div>
        </FolderSection>

        {/* ── 9. Community ───────────────────────────────────────────── */}
        <FolderSection title="Community" index={9} color="bg-background" tab={9} totalTabs={TOTAL_TABS}>
          <div className="relative flex-1 -mx-4 md:-mx-10 overflow-hidden">
            {/* Team photo, full bleed */}
            <img
              src="/assets/t-0%20team%20photo.JPG"
              alt="The T-0 team"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.7) contrast(1.05) saturate(0.82)" }}
            />

            {/* Top scrim */}
            <div
              className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(12,17,21,0.94) 0%, rgba(12,17,21,0.55) 45%, transparent 100%)",
              }}
            />
            {/* Bottom scrim */}
            <div
              className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(12,17,21,0.92) 0%, rgba(12,17,21,0.65) 40%, transparent 100%)",
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
                Join us at UNC&apos;s most ambitious startup community.
              </h2>
            </div>

            {/* Bottom bar: copyright + social icons (left) + logo (right) */}
            <div className="absolute inset-x-0 bottom-0 px-8 md:px-16 pb-7 flex items-end justify-between">
              {/* Left: copyright, icons, contact */}
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[9px] md:text-[10px] text-white/45 tracking-[0.25em] uppercase">
                  Copyright &copy; Tminus0 2026
                </p>
                <div className="flex items-center gap-5">
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/company/tminus0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-white/40 hover:text-white/80 transition-colors duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/tminus0.unc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white/40 hover:text-white/80 transition-colors duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  {/* Mail */}
                  <a
                    href="mailto:tminus0.unc@gmail.com"
                    aria-label="Email"
                    className="text-white/40 hover:text-white/80 transition-colors duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <polyline points="2,4 12,13 22,4"/>
                    </svg>
                  </a>
                </div>
                <p className="font-mono text-[8px] md:text-[9px] text-white/30 tracking-[0.15em]">
                  Have questions? Contact us at{" "}
                  <a href="mailto:tminus0.unc@gmail.com" className="text-foreground/60 hover:text-foreground transition-colors duration-200">
                    tminus0.unc@gmail.com
                  </a>
                </p>
              </div>

              {/* Right: T-0 logo */}
              <img
                src="/icon.svg"
                alt="Tminus0"
                className="w-32 h-32 md:w-40 md:h-40 select-none flex-shrink-0"
                style={{ mixBlendMode: "screen", opacity: 0.9 }}
              />
            </div>
          </div>
        </FolderSection>
      </main>
      <Analytics />
    </>
  );
}
