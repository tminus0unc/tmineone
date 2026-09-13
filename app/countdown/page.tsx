"use client";

import { useEffect } from "react";
import CountdownFromStart from "@/components/CountdownFromStart";

export default function CountdownPage() {
  useEffect(() => {
    document.title = "Countdown — T-0";
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <CountdownFromStart />
    </main>
  );
}
