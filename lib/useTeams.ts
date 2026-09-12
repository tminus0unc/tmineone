"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTeams, type Team } from "@/app/actions/teams";

const POLL_INTERVAL_MS = 2000;

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const result = await getTeams();
    if (!mounted.current) return;
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      setTeams(result.teams ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      const result = await getTeams();
      if (!mounted.current) return;
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setTeams(result.teams ?? []);
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

  return { teams, error, loading, refresh };
}

export type { Team };
