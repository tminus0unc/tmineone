"use client";

import { useEffect, useRef, useState } from "react";

type Para = {
  text: string;
  /** When lit, this paragraph turns the accent blue instead of warm white */
  accent?: boolean;
  /** Render this paragraph as a larger, bold heading */
  heading?: boolean;
};

type Props = {
  paragraphs: Para[];
  /** 0-based position of this section in the sticky scroll stack (Countdown=0, About=1 …). */
  sectionIndex: number;
  className?: string;
  /** When true, immediately completes the reveal and disables all gating (e.g. when navigating away from this slide). */
  forceComplete?: boolean;
};

const ACCENT = "#0090e0";
const WARM_WHITE = "#f0f4f8";
const DIM = "rgba(240,244,248,0.34)";

export default function ScrollReveal({ paragraphs, sectionIndex, className = "", forceComplete = false }: Props) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const unlockedRef = useRef(false);

  useEffect(() => {
    if (forceComplete) {
      progressRef.current = 1;
      setProgress(1);
      unlockedRef.current = true;
    }
  }, [forceComplete]);

  useEffect(() => {
    const scrollEl = document.querySelector("main") as HTMLElement | null;
    if (!scrollEl) return;

    const revealDistance = () => scrollEl.clientHeight * 1.35;

    const setP = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      progressRef.current = clamped;
      setProgress(clamped);
      if (clamped >= 1) unlockedRef.current = true;
    };

    const handleForward = (deltaY: number, prevent: () => void) => {
      if (unlockedRef.current) return;
      if (deltaY <= 0) return;

      const vh           = scrollEl.clientHeight;
      const sectionStart = sectionIndex * vh;
      const st           = scrollEl.scrollTop;
      const target       = st + deltaY;

      if (target <= sectionStart) return;

      prevent();
      scrollEl.scrollTop = sectionStart;
      const consumed = target - sectionStart;
      setP(progressRef.current + consumed / revealDistance());
    };

    // When scrolling back up while highlight exists, de-highlight progressively.
    const handleBackward = (deltaY: number, prevent: () => void) => {
      if (deltaY >= 0) return;
      if (progressRef.current <= 0) return;

      const vh           = scrollEl.clientHeight;
      const sectionStart = sectionIndex * vh;
      const st           = scrollEl.scrollTop;

      if (st > sectionStart + 5) return;

      prevent();
      scrollEl.scrollTop = sectionStart;
      const consumed = Math.abs(deltaY);
      const newP = Math.max(0, progressRef.current - consumed / revealDistance());
      setP(newP);
      if (newP <= 0) unlockedRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      handleForward(e.deltaY, () => e.preventDefault());
      handleBackward(e.deltaY, () => e.preventDefault());
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const deltaY = touchY - y;
      touchY = y;
      handleForward(deltaY, () => e.preventDefault());
      handleBackward(deltaY, () => e.preventDefault());
    };

    const onScroll = () => {
      const vh = scrollEl.clientHeight;
      const st = scrollEl.scrollTop;
      if (st >= (sectionIndex + 1) * vh - 10) {
        unlockedRef.current = true;
        if (progressRef.current < 1) setP(1);
      }
      // Reset when tab-clicked back above this section
      if (st < sectionIndex * vh - 10) {
        if (progressRef.current > 0) setP(0);
        unlockedRef.current = false;
      }
    };

    scrollEl.addEventListener("wheel", onWheel, { passive: false });
    scrollEl.addEventListener("touchstart", onTouchStart, { passive: true });
    scrollEl.addEventListener("touchmove", onTouchMove, { passive: false });
    scrollEl.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      scrollEl.removeEventListener("wheel", onWheel);
      scrollEl.removeEventListener("touchstart", onTouchStart);
      scrollEl.removeEventListener("touchmove", onTouchMove);
      scrollEl.removeEventListener("scroll", onScroll);
    };
  }, [sectionIndex]);

  const flat: { para: number; word: string }[] = [];
  paragraphs.forEach((p, pi) =>
    p.text.split(" ").forEach((w) => flat.push({ para: pi, word: w }))
  );
  const total    = flat.length;
  const litCount = Math.round(progress * total);

  const paraWords: { word: string; lit: boolean }[][] = paragraphs.map(() => []);
  flat.forEach(({ para, word }, i) =>
    paraWords[para].push({ word, lit: i < litCount })
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {paraWords.map((words, pi) => {
        const isAccent  = paragraphs[pi].accent;
        const isHeading = paragraphs[pi].heading;
        return (
          <p
            key={pi}
            className={
              isHeading
                ? "leading-[1.4] font-timer font-bold text-3xl md:text-4xl mb-2"
                : "leading-[1.75] font-timer font-light text-lg md:text-xl"
            }
          >
            {words.map(({ word, lit }, wi) => (
              <span
                key={wi}
                style={{
                  color: lit ? (isAccent ? ACCENT : WARM_WHITE) : DIM,
                  transition: "color 0.3s ease",
                }}
              >
                {word}
                {wi < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
