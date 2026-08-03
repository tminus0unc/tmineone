"use client";

import "./globals.css";
import React, { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import CountdownTab from "@/components/tabs/CountdownTab";
import AboutTab from "@/components/tabs/AboutTab";
import LaunchTab from "@/components/tabs/LaunchTab";
import ChallengeTab from "@/components/tabs/ChallengeTab";
import JudgesTab from "@/components/tabs/JudgesTab";
import FAQTab from "@/components/tabs/FAQTab";
import SponsorTab from "@/components/tabs/SponsorTab";
import LocationTab from "@/components/tabs/LocationTab";
import TeamTab from "@/components/tabs/TeamTab";
import CommunityTab from "@/components/tabs/CommunityTab";

const TOTAL_TABS = 10;

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "auto" });
    }
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
