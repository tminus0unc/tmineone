"use client";

import { useEffect, useState } from "react";

// Cycles 0..count-1 on a timer — used for an unattended venue TV where
// content that doesn't fit the screen advances itself instead of relying
// on someone to scroll. Clamped at read-time via modulo so shrinking
// `count` (e.g. a team gets removed) can't return a stale, out-of-range
// index.
export function useCyclingIndex(count: number, intervalMs: number): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs]);

  return count <= 0 ? 0 : index % count;
}
