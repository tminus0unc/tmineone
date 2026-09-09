"use client";

import { useEffect, useRef, useState } from "react";

/** Electric blues carried over from the T-0 logo's own glitch treatment. */
const BLUES = ["#0097ff", "#009eff", "#009bff", "#4fc3ff"];
/** How long a set of slices holds before being regenerated, in ms. */
const ROLL_MS = 55;
/**
 * Intensity envelope across the burst — stepped, not eased, so the glitch
 * stutters and drops out rather than fading politely away.
 */
const ENVELOPE = [1, 0.45, 0.95, 0.3, 0.85, 0.2, 0.55, 0.12, 0.3, 0];

const intensityAt = (t: number) =>
  ENVELOPE[Math.min(ENVELOPE.length - 1, Math.floor(t * ENVELOPE.length))];

type Slice = {
  key: number;
  top: number;
  height: number;
  dx: number;
  color: string;
  opacity: number;
};

/** A torn scanline across the line of text (never wider than the text itself). */
type Band = {
  key: number;
  top: number;
  height: number;
  opacity: number;
  color: string;
  hairline: boolean;
};

type Props = {
  text: string;
  /**
   * FolderSection `index` of the slide this sits on. The burst fires as that
   * slide scrolls in and re-arms once it is well out of view again.
   */
  sectionIndex: number;
  /** ms to wait after the slide arrives before this line bursts in. */
  delay?: number;
  /** ms the glitch burst runs for. */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Snaps a line of text into place inside a burst of electric-blue slice
 * displacement — the text is never scrambled, it just arrives through the
 * glitch and settles clean.
 */
export default function GlitchReveal({
  text,
  sectionIndex,
  delay = 0,
  duration = 850,
  className = "",
  style,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [bands, setBands] = useState<Band[]>([]);
  const [shift, setShift] = useState(0);
  const [flicker, setFlicker] = useState(1);
  const keyRef = useRef(0);

  useEffect(() => {
    const scrollEl = document.querySelector("main") as HTMLElement | null;
    if (!scrollEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let startedAt = 0;
    let lastRoll = -1;
    let armed = true;

    const tick = (now: number) => {
      const elapsed = now - startedAt - delay;
      // Hidden through the delay, then it arrives already inside the glitch.
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setVisible(true);

      const t = Math.min(1, elapsed / duration);
      const roll = Math.floor(elapsed / ROLL_MS);

      if (roll !== lastRoll) {
        lastRoll = roll;
        const power = intensityAt(t);
        const count = Math.round(power * 9);
        const next: Slice[] = [];
        for (let i = 0; i < count; i++) {
          const height = 4 + Math.random() * 12;
          next.push({
            key: keyRef.current++,
            top: Math.random() * (100 - height),
            height,
            dx: (Math.random() * 2 - 1) * 20 * power,
            color: BLUES[Math.floor(Math.random() * BLUES.length)],
            opacity: 0.45 + Math.random() * 0.5,
          });
        }
        setSlices(next);

        // Scanlines tearing across the line — confined to the text's own box.
        const tears: Band[] = [];
        for (let i = 0; i < Math.round(power * 5); i++) {
          const hairline = Math.random() < 0.6;
          tears.push({
            key: keyRef.current++,
            top: Math.random() * 100,
            height: hairline ? 1 : 2 + Math.random() * 10,
            opacity: hairline ? 0.5 + Math.random() * 0.4 : 0.1 + Math.random() * 0.2,
            color: BLUES[Math.floor(Math.random() * BLUES.length)],
            hairline,
          });
        }
        setBands(tears);

        setShift((Math.random() * 2 - 1) * 5 * power);
        // Occasional dropout of the clean text while the burst is strong.
        setFlicker(power > 0.5 && Math.random() < 0.28 ? 0.45 : 1);
      }

      if (t >= 1) {
        setSlices([]);
        setBands([]);
        setShift(0);
        setFlicker(1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduceMotion) {
        setVisible(true);
        return;
      }
      startedAt = performance.now();
      lastRoll = -1;
      raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      setVisible(false);
      setSlices([]);
      setBands([]);
      setShift(0);
      setFlicker(1);
    };

    const onScroll = () => {
      const vh = scrollEl.clientHeight;
      const st = scrollEl.scrollTop;
      // FolderSection pins slide `index` at (index - 1) viewports of scroll.
      const sectionStart = (sectionIndex - 1) * vh;

      if (armed && st >= sectionStart - vh * 0.4) {
        armed = false;
        start();
      } else if (!armed && st < sectionStart - vh * 0.9) {
        armed = true;
        reset();
      }
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [text, sectionIndex, delay, duration]);

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ ...style, opacity: visible ? 1 : 0 }}
    >
      {/* Displaced blue slices, torn out of copies of the same line. */}
      {slices.map((s) => (
        <span
          key={s.key}
          aria-hidden
          className="absolute left-0 top-0 w-full select-none pointer-events-none"
          style={{
            clipPath: `inset(${s.top}% 0 ${100 - s.top - s.height}% 0)`,
            transform: `translateX(${s.dx}px)`,
            color: s.color,
            opacity: s.opacity,
            filter: "blur(1.4px)",
          }}
        >
          {text}
        </span>
      ))}

      <span
        className="relative block"
        style={{ transform: `translateX(${shift}px)`, opacity: flicker }}
      >
        {text}
      </span>

      {/* Scanline tears, clipped to this line of text and nothing else. */}
      {bands.map((b) => (
        <span
          key={b.key}
          aria-hidden
          className="absolute left-0 w-full pointer-events-none"
          style={{
            top: `${b.top}%`,
            height: `${b.height}px`,
            background: b.color,
            opacity: b.opacity,
            mixBlendMode: "screen",
            filter: b.hairline ? "none" : "blur(1px)",
          }}
        />
      ))}
    </span>
  );
}
