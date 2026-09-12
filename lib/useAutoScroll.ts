"use client";

import { useEffect } from "react";

const SCROLL_SPEED_PX_PER_SEC = 55;
const PAUSE_AT_EDGE_MS = 4000;

// Teleprompter-style auto-scroll for an unattended venue TV: slowly scrolls
// to the bottom, pauses, scrolls back to top, pauses, repeats — only doing
// anything once content is actually taller than the viewport. Pure DOM
// scrolling (no React state), so it can run every frame without tripping
// any "don't setState in a loop" concerns.
export function useAutoScroll(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    let frame: number;
    let phase: "down" | "pause-bottom" | "up" | "pause-top" = "down";
    let pauseUntil = 0;
    let lastTime: number | null = null;

    function tick(time: number) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 4) {
        lastTime = time;
        frame = requestAnimationFrame(tick);
        return;
      }

      if (phase === "pause-bottom" || phase === "pause-top") {
        if (time >= pauseUntil) phase = phase === "pause-bottom" ? "up" : "down";
        lastTime = time;
        frame = requestAnimationFrame(tick);
        return;
      }

      const dt = lastTime === null ? 0 : (time - lastTime) / 1000;
      lastTime = time;
      const next = window.scrollY + SCROLL_SPEED_PX_PER_SEC * dt * (phase === "down" ? 1 : -1);

      if (phase === "down" && next >= maxScroll) {
        window.scrollTo(0, maxScroll);
        phase = "pause-bottom";
        pauseUntil = time + PAUSE_AT_EDGE_MS;
      } else if (phase === "up" && next <= 0) {
        window.scrollTo(0, 0);
        phase = "pause-top";
        pauseUntil = time + PAUSE_AT_EDGE_MS;
      } else {
        window.scrollTo(0, next);
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);
}
