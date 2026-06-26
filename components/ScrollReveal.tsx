"use client";

import { useEffect, useRef, useState } from "react";

type Para = {
  text: string;
  /** When lit, this paragraph turns the accent blue instead of warm white */
  accent?: boolean;
};

type Props = {
  paragraphs: Para[];
  /** 0-based position of this section in the sticky scroll stack (Countdown=0, About=1 …). */
  sectionIndex: number;
  className?: string;
};

const ACCENT = "#0090e0";
const WARM_WHITE = "#f0f4f8";
const DIM = "rgba(240,244,248,0.34)";

export default function ScrollReveal({ paragraphs, sectionIndex, className = "" }: Props) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const scrollEl = document.querySelector("main") as HTMLElement | null;
    if (!scrollEl) return;

    // How much wheel/touch travel (px) is needed to fully reveal the text.
    const revealDistance = () => scrollEl.clientHeight * 1.35;

    const setP = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      progressRef.current = clamped;
      setProgress(clamped);
      if (clamped >= 1) unlockedRef.current = true;
    };

    // ── PIN + SCRUB ───────────────────────────────────────────────────────────
    // While the user is entering / sitting on this section and the text isn't
    // fully revealed yet, we freeze scrollTop at the section's top and convert
    // forward scroll input into reveal progress. The next section therefore
    // cannot slide up until every word is lit and readable.
    const handleForward = (deltaY: number, prevent: () => void) => {
      if (unlockedRef.current) return; // already read → free scroll
      if (deltaY <= 0) return;          // backward → allow leaving upward

      const vh           = scrollEl.clientHeight;
      const sectionStart = sectionIndex * vh;
      const st           = scrollEl.scrollTop;
      const target       = st + deltaY;

      if (target <= sectionStart) return; // still approaching from previous section

      // Pin at the section top and scrub the reveal with the overflow.
      prevent();
      scrollEl.scrollTop = sectionStart;
      const consumed = target - sectionStart;
      setP(progressRef.current + consumed / revealDistance());
    };

    const onWheel = (e: WheelEvent) =>
      handleForward(e.deltaY, () => e.preventDefault());

    // Touch support
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const deltaY = touchY - y; // finger up = scroll down
      touchY = y;
      handleForward(deltaY, () => e.preventDefault());
    };

    // If the user jumps past this section via a tab click, stop gating.
    const onScroll = () => {
      const vh = scrollEl.clientHeight;
      if (scrollEl.scrollTop >= (sectionIndex + 1) * vh - 10) {
        unlockedRef.current = true;
        if (progressRef.current < 1) setP(1);
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

  // Flatten so each word gets a global reveal index
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
    <div className={`space-y-5 ${className}`}>
      {paraWords.map((words, pi) => {
        const isAccent = paragraphs[pi].accent;
        return (
          <p key={pi} className="leading-[1.7] font-timer font-light text-base md:text-lg">
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
