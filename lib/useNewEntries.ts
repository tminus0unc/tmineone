"use client";

import { useEffect, useRef, useState } from "react";
import type { MoneyEntry } from "@/app/actions/moneyTracker";

// Returns the batch of entries that showed up since the previous poll — a
// "pulse" consumed by flash-highlighting and the raise spotlight banner.
// Empty on the very first load, since nothing is "new" yet at that point.
export function useNewEntries(entries: MoneyEntry[], loading: boolean): MoneyEntry[] {
  const seenIds = useRef<Set<string> | null>(null);
  const [arrived, setArrived] = useState<MoneyEntry[]>([]);

  useEffect(() => {
    if (loading) return;
    const currentIds = new Set(entries.map((e) => e.id));
    if (seenIds.current === null) {
      seenIds.current = currentIds;
      return;
    }
    const fresh = entries.filter((e) => !seenIds.current!.has(e.id));
    seenIds.current = currentIds;
    if (fresh.length === 0) return;

    const timeout = setTimeout(() => setArrived(fresh), 0);
    return () => clearTimeout(timeout);
  }, [entries, loading]);

  return arrived;
}
