"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Para = {
  text: string;
  /** Render this paragraph in the accent blue once revealed. */
  accent?: boolean;
};

type Props = {
  /** Lands word by word while the countdown dissolves (phase 1). */
  headline: string;
  /** Lands word by word once the countdown is gone (phase 2). */
  paragraphs: Para[];
  /** 0-based index of the section whose scroll position pins phase 2 (About = 1). */
  sectionIndex: number;
};

const ACCENT = "#0090e0";
const WARM_WHITE = "#f0f4f8";

/** Window within phase 1, in units of t1, over which the headline lands. */
const HEADLINE_START = 0.3;
const HEADLINE_END = 0.92;
/** Blur the countdown picks up, in px, by the time it is fully gone. */
const COUNTDOWN_BLUR = 22;
/** The countdown fades out over the first 1/1.9 of phase 1, well before the end. */
const COUNTDOWN_FADE_RATE = 1.9;
/** How far the globe dims once the intro copy owns the screen. */
const SCRIM_MAX = 0.45;
/** Window in t1 over which the copy layer itself fades up from nothing. */
const COPY_IN_START = 0.08;
const COPY_IN_END = 0.3;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Drives the countdown → about transition as one continuous scroll gesture.
 *
 * Phase 1 (t1) tracks real scroll across the first viewport: the countdown
 * blurs away, the globe dims, and the headline fades in over the globe's curve.
 * Phase 2 (p2) pins the scroll at the About section and consumes wheel/touch
 * delta to reveal the remaining copy, so the globe never moves under it.
 */
export default function IntroReveal({ headline, paragraphs, sectionIndex }: Props) {
  const headlineWords = useMemo(() => headline.split(" "), [headline]);
  const bodyWords = useMemo(() => {
    const flat: { para: number; word: string }[] = [];
    paragraphs.forEach((p, pi) =>
      p.text.split(" ").forEach((w) => flat.push({ para: pi, word: w }))
    );
    return flat;
  }, [paragraphs]);

  const [headlineLit, setHeadlineLit] = useState(0);
  const [bodyLit, setBodyLit] = useState(0);

  const t1Ref = useRef(0);
  const p2Ref = useRef(0);
  const unlockedRef = useRef(false);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = document.querySelector("main") as HTMLElement | null;
    if (!scrollEl) return;
    const sectionEl = document.getElementById("Countdown");

    const totalBody = bodyWords.length;
    const revealDistance = () => scrollEl.clientHeight * 1.35;

    const fadeEls = Array.from(
      sectionEl?.querySelectorAll<HTMLElement>(".intro-fade") ?? []
    );
    const scrimEls = Array.from(
      sectionEl?.querySelectorAll<HTMLElement>(".intro-scrim") ?? []
    );

    // Without these the countdown never clears and the intro copy lands on top
    // of it — a visibly broken homepage, so say so rather than degrade quietly.
    if (!sectionEl || fadeEls.length === 0 || scrimEls.length === 0) {
      const msg =
        "IntroReveal: missing #Countdown / .intro-fade / .intro-scrim targets — " +
        "the countdown will not dissolve.";
      console.error(msg, { sectionEl, fadeEls, scrimEls });
      if (process.env.NODE_ENV !== "production") throw new Error(msg);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const t1 = t1Ref.current;

      const blur = reduceMotion ? 0 : t1 * COUNTDOWN_BLUR;
      const fade = Math.max(0, 1 - t1 * COUNTDOWN_FADE_RATE);
      for (const el of fadeEls) {
        el.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "";
        el.style.opacity = fade.toFixed(3);
        el.style.pointerEvents = fade < 0.5 ? "none" : "";
      }
      for (const el of scrimEls) el.style.opacity = (t1 * SCRIM_MAX).toFixed(3);

      // Held at nothing until the countdown starts clearing, so the unrevealed
      // (blurred) copy never smudges the globe while the timer is still up.
      if (copyRef.current) {
        const copyIn = clamp01((t1 - COPY_IN_START) / (COPY_IN_END - COPY_IN_START));
        copyRef.current.style.opacity = copyIn.toFixed(3);
      }

      const hp = (t1 - HEADLINE_START) / (HEADLINE_END - HEADLINE_START);
      // React bails out when these land on the same integer, so most frames
      // only touch the CSS variable above.
      setHeadlineLit(Math.round(clamp01(hp) * headlineWords.length));
      setBodyLit(Math.round(p2Ref.current * totalBody));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    /** Phase 1 rides the real scroll position — smooth, and reversible for free. */
    const syncPhase1 = () => {
      t1Ref.current = clamp01(scrollEl.scrollTop / scrollEl.clientHeight);
      schedule();
    };

    const setP2 = (p: number) => {
      const clamped = clamp01(p);
      p2Ref.current = clamped;
      if (clamped >= 1) unlockedRef.current = true;
      schedule();
    };

    const handleForward = (deltaY: number, prevent: () => void) => {
      if (unlockedRef.current) return;
      if (deltaY <= 0) return;

      const sectionStart = sectionIndex * scrollEl.clientHeight;
      const target = scrollEl.scrollTop + deltaY;
      // Still inside phase 1 — let the scroll through untouched.
      if (target <= sectionStart) return;

      prevent();
      scrollEl.scrollTop = sectionStart;
      setP2(p2Ref.current + (target - sectionStart) / revealDistance());
    };

    const handleBackward = (deltaY: number, prevent: () => void) => {
      if (deltaY >= 0) return;
      if (p2Ref.current <= 0) return;

      const sectionStart = sectionIndex * scrollEl.clientHeight;
      if (scrollEl.scrollTop > sectionStart + 5) return;

      prevent();
      scrollEl.scrollTop = sectionStart;
      const newP = clamp01(p2Ref.current - Math.abs(deltaY) / revealDistance());
      setP2(newP);
      if (newP <= 0) unlockedRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      handleForward(e.deltaY, () => e.preventDefault());
      handleBackward(e.deltaY, () => e.preventDefault());
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const deltaY = touchY - y;
      touchY = y;
      handleForward(deltaY, () => e.preventDefault());
      handleBackward(deltaY, () => e.preventDefault());
    };

    const onScroll = () => {
      syncPhase1();

      const vh = scrollEl.clientHeight;
      const st = scrollEl.scrollTop;
      // Jumped past the About section (tab click): complete the reveal.
      if (st >= (sectionIndex + 1) * vh - 10) {
        unlockedRef.current = true;
        if (p2Ref.current < 1) setP2(1);
      }
      // Back above the About section: re-arm the reveal.
      if (st < sectionIndex * vh - 10) {
        if (p2Ref.current > 0) setP2(0);
        unlockedRef.current = false;
      }
    };

    scrollEl.addEventListener("wheel", onWheel, { passive: false });
    scrollEl.addEventListener("touchstart", onTouchStart, { passive: true });
    scrollEl.addEventListener("touchmove", onTouchMove, { passive: false });
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      scrollEl.removeEventListener("wheel", onWheel);
      scrollEl.removeEventListener("touchstart", onTouchStart);
      scrollEl.removeEventListener("touchmove", onTouchMove);
      scrollEl.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      for (const el of [...fadeEls, ...scrimEls]) {
        el.style.filter = "";
        el.style.opacity = "";
        el.style.pointerEvents = "";
      }
    };
  }, [sectionIndex, headlineWords.length, bodyWords]);

  const grouped: { word: string; lit: boolean }[][] = paragraphs.map(() => []);
  bodyWords.forEach(({ para, word }, i) => grouped[para].push({ word, lit: i < bodyLit }));

  return (
    <div
      ref={copyRef}
      className="absolute left-0 right-0 z-20 flex justify-center px-6 pointer-events-none"
      style={{ top: "clamp(11%, calc(50% - var(--globe-size) / 2), 20%)", opacity: 0 }}
    >
      {/* Same soft drop shadow the countdown digits use, so the copy holds up
          over the globe's bright limb. */}
      <div
        className="w-full max-w-2xl text-center"
        style={{ textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}
      >
        {/* Pulled up by half a line so the headline straddles the globe's top curve. */}
        <h2
          className="font-timer font-light text-3xl md:text-5xl leading-[1.35] tracking-[0.02em]"
          style={{ marginTop: "-0.675em" }}
        >
          {headlineWords.map((word, i) => (
            <Word
              key={i}
              word={word}
              lit={i < headlineLit}
              color={WARM_WHITE}
              blur={14}
              space={i < headlineWords.length - 1}
            />
          ))}
        </h2>

        <div className="mt-6 md:mt-8 space-y-4 md:space-y-5">
          {grouped.map((words, pi) => (
            <p
              key={pi}
              className="font-timer font-light text-[15px] md:text-xl leading-[1.7] md:leading-[1.75]"
            >
              {words.map(({ word, lit }, wi) => (
                <Word
                  key={wi}
                  word={word}
                  lit={lit}
                  color={paragraphs[pi].accent ? ACCENT : WARM_WHITE}
                  blur={6}
                  space={wi < words.length - 1}
                />
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One word of the reveal: soft and near-transparent until scrolled into focus. */
function Word({
  word,
  lit,
  color,
  blur,
  space,
}: {
  word: string;
  lit: boolean;
  color: string;
  blur: number;
  space: boolean;
}) {
  return (
    <>
      <span
        style={{
          display: "inline-block",
          color,
          filter: lit ? "blur(0px)" : `blur(${blur}px)`,
          opacity: lit ? 1 : 0.22,
          transition: "filter 0.55s ease, opacity 0.55s ease",
        }}
      >
        {word}
      </span>
      {space ? " " : null}
    </>
  );
}
