"use client";

import { useEffect, useRef, useState } from "react";
import { getMoneyEntries, type MoneyEntry } from "@/app/actions/moneyTracker";

const POLL_INTERVAL_MS = 4000;

export function useMoneyTrackerData() {
  const [entries, setEntries] = useState<MoneyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      const result = await getMoneyEntries();
      if (!mounted.current) return;
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setEntries(result.entries ?? []);
        setLastUpdated(Date.now());
      }
      setLoading(false);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return { entries, error, loading, lastUpdated };
}

export type { MoneyEntry };
