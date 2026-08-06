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
        <CountdownTab totalTabs={TOTAL_TABS} />
        <AboutTab totalTabs={TOTAL_TABS} />
        <LaunchTab totalTabs={TOTAL_TABS} />
        <ChallengeTab totalTabs={TOTAL_TABS} />
        <JudgesTab totalTabs={TOTAL_TABS} />
        <FAQTab totalTabs={TOTAL_TABS} />
        <SponsorTab totalTabs={TOTAL_TABS} />
        <LocationTab totalTabs={TOTAL_TABS} />
        <TeamTab totalTabs={TOTAL_TABS} />
        <CommunityTab totalTabs={TOTAL_TABS} />
      </main>
      <Analytics />
    </>
  );
}
