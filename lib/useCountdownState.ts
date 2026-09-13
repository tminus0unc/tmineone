"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCountdownStartTime } from "@/app/actions/countdown";

const POLL_INTERVAL_MS = 2000;

export function useCountdownState() {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const result = await getCountdownStartTime();
    if (!mounted.current) return;
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      setStartTime(result.startTime ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      const result = await getCountdownStartTime();
      if (!mounted.current) return;
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setStartTime(result.startTime ?? null);
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

  return { startTime, error, loading, refresh };
}
