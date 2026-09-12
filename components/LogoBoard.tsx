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
  /** Smaller tile/box — for logos of contributors who gave less than the main sponsors. */
  size?: "sm";
  /**
   * Bare mode only: explicit height classes (width is always auto, so the mark
   * keeps its native proportions). Source images vary a lot in how much
   * transparent padding surrounds the actual mark, so matching box height
   * alone doesn't make two logos *look* the same size — tune this per item by
   * eye instead.
   */
  heightClass?: string;
};

export type LogoGroup = {
  title: string;
  /** Flat, wrapping row — used unless `rows` is given. */
  items?: LogoItem[];
  /** Bare mode only: explicit rows, each laid out on its own line. */
  rows?: LogoItem[][];
  /** No card, no border, no caption — just the mark floating on the background. */
  bare?: boolean;
};

type Props = {
  groups: LogoGroup[];
  /** FolderSection `index` of this slide — the unblur is tied to its arrival. */
  sectionIndex: number;
};

/** Scroll window (in viewports of arrival) each element unblurs across. */
const TITLE_SPAN = 0.2;
const TITLE_GROUP_OFFSET = 0.3;
const CARD_START = 0.3;
const CARD_STAGGER = 0.1;
const CARD_SPAN = 0.16;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const TILE_SIZE = "w-[104px] h-[104px] sm:w-[132px] sm:h-[132px] md:w-[180px] md:h-[180px]";
const TILE_SIZE_SM = "w-[72px] h-[72px] sm:w-[92px] sm:h-[92px] md:w-[125px] md:h-[125px]";
const BARE_HEIGHT_DEFAULT = "h-14 sm:h-16 md:h-20";

/**
 * A slide that is nothing but a heading and a row of logo tiles — repeated for
 * each group (e.g. "Sponsors", then a smaller "Partners" row underneath). Each
 * tile sharpens out of a blur as the slide scrolls in, staggered left to right
 * and group by group.
 */
export default function LogoBoard({ groups, sectionIndex }: Props) {
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

  let cardIndex = 0;

  const renderItem = (item: LogoItem, bare: boolean) => {
    const i = cardIndex++;
    const start = CARD_START + i * CARD_STAGGER;
    const p = clamp01((t - start) / CARD_SPAN);

    if (bare) {
      return (
        <div
          key={item.src}
          className={`flex items-center justify-center ${item.heightClass ?? BARE_HEIGHT_DEFAULT}`}
          style={{ filter: `blur(${((1 - p) * 14).toFixed(2)}px)`, opacity: p }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className="w-auto h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div
        key={item.src}
        className="flex flex-col items-center gap-3 md:gap-4"
        style={{ filter: `blur(${((1 - p) * 14).toFixed(2)}px)`, opacity: p }}
      >
        <div
          className={`
            group flex items-center justify-center overflow-hidden
            ${item.size === "sm" ? TILE_SIZE_SM : TILE_SIZE}
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
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start gap-10 md:gap-14 px-8 pt-12 pb-8 md:pt-16 min-h-0">
      {groups.map((group, groupIndex) => {
        const titleStart = groupIndex * TITLE_GROUP_OFFSET;
        const titleIn = clamp01((t - titleStart) / TITLE_SPAN);

        return (
          <div key={group.title} className="flex flex-col items-center gap-8 md:gap-12">
            <h2
              className="font-timer font-light text-3xl md:text-5xl tracking-[0.02em] leading-[1.35] text-center"
              style={{
                color: "#f0f4f8",
                filter: `blur(${((1 - titleIn) * 12).toFixed(2)}px)`,
                opacity: titleIn,
              }}
            >
              {group.title}
            </h2>

            {group.rows ? (
              <div className="flex flex-col items-center gap-6 md:gap-10">
                {group.rows.map((row, ri) => (
                  <div key={ri} className="flex items-center justify-center gap-10 sm:gap-14 md:gap-20">
                    {row.map((item) => renderItem(item, true))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 md:gap-20">
                {(group.items ?? []).map((item) => renderItem(item, Boolean(group.bare)))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
