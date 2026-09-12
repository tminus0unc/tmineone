"use client";

import { useEffect, useRef, useState } from "react";
import type { MoneyEntry } from "@/app/actions/moneyTracker";
import { formatCurrency } from "@/lib/format";

const DISPLAY_MS = 4500;
const GAP_MS = 400;

// Big banner that takes over the top of the screen when a new raise lands —
// meant to be readable from across a room, unlike a hover tooltip. Queues
// simultaneous raises so they announce one at a time instead of overlapping.
export default function RaiseSpotlight({ newEntries }: { newEntries: MoneyEntry[] }) {
  const queueRef = useRef<MoneyEntry[]>([]);
  const advancingRef = useRef(false);
  const [current, setCurrent] = useState<MoneyEntry | null>(null);

  useEffect(() => {
    if (newEntries.length === 0) return;
    queueRef.current.push(...newEntries);

    function advance() {
      if (advancingRef.current) return;
      const next = queueRef.current.shift();
      if (!next) return;
      advancingRef.current = true;
      setCurrent(next);
      setTimeout(() => {
        setCurrent(null);
        advancingRef.current = false;
        setTimeout(advance, GAP_MS);
      }, DISPLAY_MS);
    }

    const kick = setTimeout(advance, 0);
    return () => clearTimeout(kick);
  }, [newEntries]);

  if (!current) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-6 md:pt-10 pointer-events-none">
      <div
        key={current.id}
        className="animate-[contentReveal_0.4s_ease-out] bg-[#0c1115] border border-emerald-400/40 px-8 py-6 md:px-14 md:py-9 max-w-5xl w-full"
        style={{ boxShadow: "0 0 70px rgba(16,185,129,0.25)" }}
      >
        <p className="font-mono text-[11px] md:text-sm text-emerald-400/80 tracking-[0.4em] uppercase mb-3">Just raised</p>
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <span className="font-mono text-2xl md:text-4xl tracking-[0.05em] uppercase text-white/90 truncate">
            {current.team}
          </span>
          <span className="font-timer font-light text-5xl md:text-7xl tabular-nums flex-shrink-0" style={{ color: "#f0f4f8" }}>
            {formatCurrency(current.amount)}
          </span>
        </div>
      </div>
    </div>
  );
}
