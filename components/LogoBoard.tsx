"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type LogoItem = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  /**
   * Set for wide wordmarks. In a square tile they are limited by width, so they
   * come out visually tiny next to square badges — they get less padding.
   */
  wide?: boolean;
};

type Props = {
  title: string;
  items: LogoItem[];
  /** FolderSection `index` of this slide — the unblur is tied to its arrival. */
  sectionIndex: number;
};

/** Scroll window (in viewports of arrival) each element unblurs across. */
const TITLE_IN = [0.14, 0.34];
const CARD_START = 0.3;
const CARD_STAGGER = 0.1;
const CARD_SPAN = 0.16;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * A slide that is nothing but a heading and a row of logo tiles. Each tile
 * sharpens out of a blur as the slide scrolls in, staggered left to right.
 */
export default function LogoBoard({ title, items, sectionIndex }: Props) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const scrollEl = document.querySelector("main") as HTMLElement | null;
    if (!scrollEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(1);
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const vh = scrollEl.clientHeight;
        // The slide travels up across the viewport before pinning at (index - 1).
        const arrival = (scrollEl.scrollTop - (sectionIndex - 2) * vh) / vh;
        setT(clamp01(arrival));
      });
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionIndex]);

  const titleIn = clamp01((t - TITLE_IN[0]) / (TITLE_IN[1] - TITLE_IN[0]));

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 md:gap-16 px-8 py-8 min-h-0">
      <h2
        className="font-timer font-light text-3xl md:text-5xl tracking-[0.02em] leading-[1.35] text-center"
        style={{
          color: "#f0f4f8",
          filter: `blur(${((1 - titleIn) * 12).toFixed(2)}px)`,
          opacity: titleIn,
        }}
      >
        {title}
      </h2>

      <div className="flex flex-wrap items-start justify-center gap-8 sm:gap-10 md:gap-20">
        {items.map((item, i) => {
          const start = CARD_START + i * CARD_STAGGER;
          const p = clamp01((t - start) / CARD_SPAN);
          return (
            <div
              key={item.src}
              className="flex flex-col items-center gap-3 md:gap-4"
              style={{ filter: `blur(${((1 - p) * 14).toFixed(2)}px)`, opacity: p }}
            >
              <div
                className={`
                  group flex items-center justify-center overflow-hidden
                  w-[104px] h-[104px] sm:w-[132px] sm:h-[132px] md:w-[180px] md:h-[180px]
                  ${item.wide ? "p-3 sm:p-4 md:p-5" : "p-0"}
                  rounded-2xl border border-white/12 bg-white/[0.04]
                  transition-colors duration-300
                  hover:border-white/30 hover:bg-white/[0.06]
                `}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-mono text-[9px] md:text-[10px] text-white/45 tracking-[0.3em] uppercase text-center">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
