"use client";

import Timer from "@/components/Timer";
import "./globals.css";
import React from "react";
import FolderSection from "@/components/FolderSection";
import ScrollDownButton from "@/components/Scroller";
import FolderWatermark from "@/components/FolderWatermark";
import MapEmbed from "@/components/MapEmbeded";
import {imageOptimizer} from "next/dist/server/image-optimizer";
import AppForm from "@/components/AppForm";

export default function Home() {
  return (
    <main className="bg-background h-screen overflow-y-scroll">
      <FolderSection title="Countdown" index={1} color="bg-background" tab={1}>
        <Timer className={"font-timer font-bold"} />
        <ScrollDownButton targetId={"About Us"} />
      </FolderSection>

      <FolderSection title="About Us" index={2} color="bg-background" tab={4}>
        <FolderWatermark label={" Confidential"} />

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-6xl w-full px-8 md:px-12 flex flex-row items-center gap-12">
            {/* Left: Image */}
            <div className="hidden md:flex flex-shrink-0 w-80 h-96 items-center justify-center">
              <img
                src="/placeholder.jpg"
                alt="About T-0"
                className="w-full h-full object-cover rounded-sm opacity-80"
              />
            </div>

            {/* Right: Text */}
            <div className="text-left text-white flex-1">
              <p className="text-foreground uppercase tracking-[0.4em] text-sm mb-8">
                What is T-0?
              </p>

              <div className="space-y-8 text-xl leading-relaxed text-white/90">
                <p className="text-5xl font-bold text-white">
                  Ideas are everywhere.
                </p>

                <p>
                  Classroom conversations. Group chats. Late-night talks. The hard part: execution. People plan more than act, and brainstorm more than build.
                </p>

                <p>
                  T-0 is a startup-inspired challenge created to fix this. Participants are dropped into an unexpected challenge and given limited time to respond, adapt, and execute. The catch?
                </p>

                <div className="mt-8 flex items-center">
                  <div
                    className="
                mr-4 h-8 w-px bg-foreground
                shadow-[0_0_10px_rgba(34,211,238,.8)]
              "
                  />
                  <p className="text-xs uppercase tracking-[0.5em] text-foreground/80">
                    The challenge isn't revealed until start time.
                  </p>
                </div>

                <p>
                  At its core, T-0 is about cultivating a culture of creativity, problem-solving, and execution, and giving students a space to practice all three.
                </p>

                <p>Ready at T-minus zero.</p>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() =>
                      document
                        .getElementById("Sign Up")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="
      border border-foreground/40 px-8 py-3
      text-xs uppercase tracking-[0.5em] text-foreground
      transition-all duration-300 hover:border-foreground
      hover:bg-foreground/5 hover:text-white
      font-mono
    "
                  >
                    Apply
                  </button>

                  <button
                    onClick={() =>
                      document
                        .getElementById("Location")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="
      border border-foreground/40 px-8 py-3
      text-xs uppercase tracking-[0.5em] text-foreground
      transition-all duration-300 hover:border-foreground
      hover:bg-foreground/5 hover:text-white
      font-mono
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

      <FolderSection title="Location" index={3} color="bg-background" tab={3}>
        <div className="flex-1 flex flex-col gap-6 py-8">
          {/* Map */}
          <div className="flex-1  overflow-hidden m-2.5">
            <MapEmbed />
          </div>

          <div className="pb-8 flex justify-center">
            <ScrollDownButton targetId={"Sign Up"} />
          </div>
        </div>
      </FolderSection>

      <FolderSection title="Sign Up" index={4} color="bg-[#0f0]" tab={2}>
        <FolderWatermark label={" Confidential"} />
        <div className="text-black text-2xl"></div>


        <AppForm />

        <ScrollDownButton targetId={"Team"} />
      </FolderSection>

      <FolderSection title="Team" index={5} color="bg-[#00f]" tab={5}>
        <FolderWatermark label={" Confidential"} />


      </FolderSection>
    </main>
  );
}
