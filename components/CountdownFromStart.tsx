'use client';

import { useEffect, useState } from 'react';
import Globe from "@/components/Globe";
import { useCountdownState } from "@/lib/useCountdownState";

const DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

type CountdownFromStartProps = {
    className?: string;
};

export default function CountdownFromStart({ className }: CountdownFromStartProps) {
    const { startTime, loading } = useCountdownState();
    const [remaining, setRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (!startTime) {
            const timeout = setTimeout(() => setRemaining(null), 0);
            return () => clearTimeout(timeout);
        }
        const target = new Date(startTime).getTime() + DURATION_MS;
        function tick() {
            setRemaining(Math.max(0, target - Date.now()));
        }
        const kickoff = setTimeout(tick, 0);
        const interval = setInterval(tick, 1000);
        return () => {
            clearTimeout(kickoff);
            clearInterval(interval);
        };
    }, [startTime]);

    const isRunning = Boolean(startTime);
    const isDone = isRunning && remaining !== null && remaining <= 0;
    const totalSeconds = Math.floor((remaining ?? DURATION_MS) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const units = [
        { value: hours, label: "Hours" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Seconds" },
    ];

    return (
        <div className={`relative flex-1 w-full h-full ${className || ""}`}>
            <Globe />

            <div className="relative z-10 h-full grid grid-cols-3">
                {units.map(({ value, label }) => (
                    <div
                        key={label}
                        className="
                            group relative flex flex-col items-center justify-center
                            border-l border-white/10 first:border-l-0
                            transition-colors duration-500
                        "
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse at center, rgba(0,144,224,0.12), transparent 70%)",
                            }}
                        />
                        <span
                            className="
                                relative font-timer font-thin tabular-nums leading-none
                                text-[16vw] tracking-[-0.02em]
                                drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]
                            "
                            style={{ color: isDone ? "#e66767" : "#f0f4f8" }}
                            suppressHydrationWarning
                        >
                            {String(value).padStart(2, "0")}
                        </span>
                        <span
                            className="
                                relative mt-4 md:mt-6 font-mono text-[10px] md:text-[13px]
                                tracking-[0.3em] text-white/50 uppercase
                            "
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {!loading && !isRunning && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70">
                    <span className="font-mono text-sm md:text-base tracking-[0.4em] uppercase text-white/50">
                        Waiting to start…
                    </span>
                </div>
            )}

            {isRunning && isDone && (
                <div className="absolute bottom-[8%] left-0 right-0 z-10 text-center">
                    <span className="font-mono text-[11px] md:text-[13px] text-red-400/80 tracking-[0.3em] uppercase">
                        Time&apos;s up
                    </span>
                </div>
            )}
            {isRunning && !isDone && (
                <div className="absolute bottom-[8%] left-0 right-0 z-10 text-center">
                    <span className="font-mono text-[11px] md:text-[13px] text-white/45 tracking-[0.3em] uppercase">
                        4-hour challenge countdown
                    </span>
                </div>
            )}
        </div>
    );
}
