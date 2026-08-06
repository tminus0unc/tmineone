"use client";

import { useState } from "react";

type Props = {
  /** Fires the instant the user clicks, before any animation plays — lets the parent start revealing content underneath in parallel. */
  onOpening: () => void;
  /** Fires once the open/exit sequence has fully finished — safe to unmount this component. */
  onOpen: () => void;
};

export default function Envelope({ onOpening, onOpen }: Props) {
  const [opened, setOpened] = useState(false);
  const [exiting, setExiting] = useState(false);

  function handleClick() {
    if (opened) return;
    onOpening();
    setOpened(true);
    setTimeout(() => setExiting(true), 620);
    setTimeout(onOpen, 900);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open your invite"
      className="group relative w-full max-w-sm mx-auto block"
      style={{ perspective: "1000px" }}
    >
      <div
        style={{
          animation: opened ? "none" : "envelopeFloat 3.4s ease-in-out infinite",
        }}
      >
        {/* Body */}
        <div
          className="relative h-40 md:h-52 rounded-sm border border-foreground/25 bg-[#141a20] overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition-colors duration-300 group-hover:border-foreground/50"
          style={{
            transform: exiting ? "scale(0.8) translateY(-18px)" : "scale(1) translateY(0)",
            opacity: exiting ? 0 : 1,
            filter: exiting ? "blur(8px)" : "blur(0px)",
            transition:
              "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, filter 220ms ease",
          }}
        >
          {/* Letter */}
          <div
            className="absolute inset-x-5 top-5 bottom-5 rounded-sm border border-foreground/20 bg-[#0c1115] flex items-center justify-center"
            style={{
              zIndex: 1,
              transform: opened
                ? "translateY(-92%) scale(1.05) rotate(-2deg)"
                : "translateY(6%) scale(0.96) rotate(0deg)",
              opacity: opened ? 1 : 0,
              transition:
                "transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1) 120ms, opacity 360ms ease 120ms",
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/70">
              T-0
            </span>
          </div>

          {/* Flap */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 border-b border-foreground/20 bg-[#1a2129]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              transform: opened ? "rotateX(-155deg)" : "rotateX(0deg)",
              transition: "transform 480ms cubic-bezier(0.65, 0, 0.35, 1)",
              zIndex: 2,
            }}
          />

          {/* Seal */}
          <div
            className="absolute left-1/2 top-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border border-foreground/50 bg-background flex items-center justify-center transition-colors duration-300 group-hover:border-foreground"
            style={{
              zIndex: 3,
              transform: opened
                ? "translate(-50%, -50%) scale(0.4) rotate(-20deg)"
                : "translate(-50%, -50%) scale(1) rotate(0deg)",
              opacity: opened ? 0 : 1,
              transition: "opacity 220ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <span className="font-mono text-[9px] tracking-[0.2em] text-foreground">
              T·0
            </span>
          </div>
        </div>
      </div>

      <p
        className="mt-5 font-mono text-[10px] tracking-[0.4em] uppercase text-white/40 group-hover:text-white/70 transition-colors duration-300 animate-pulse text-center"
        style={{
          opacity: exiting ? 0 : 1,
          transition: "opacity 140ms ease",
        }}
      >
        Tap to open
      </p>
    </button>
  );
}
