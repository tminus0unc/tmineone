'use client';

import { useEffect, useState } from 'react';
import Globe from "@/components/Globe";

const DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
const STORAGE_KEY = "t0-countdown-from-start";

type CountdownFromStartProps = {
    className?: string;
};

export default function CountdownFromStart({ className }: CountdownFromStartProps) {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);

    // Resume a countdown already in progress (e.g. the page got reloaded
    // mid-event) instead of losing it back to the Start screen.
    useEffect(() => {
        const timeout = setTimeout(() => {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            setStartTime(stored ? Number(stored) : null);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (startTime === null) {
            const timeout = setTimeout(() => setRemaining(null), 0);
            return () => clearTimeout(timeout);
        }
        const target = startTime + DURATION_MS;
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

    function handleStart() {
        const t = Date.now();
        window.localStorage.setItem(STORAGE_KEY, String(t));
        setStartTime(t);
    }

    function handleReset() {
        window.localStorage.removeItem(STORAGE_KEY);
        setStartTime(null);
    }

    const isRunning = startTime !== null;
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

            {!isRunning && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70">
                    <button
                        onClick={handleStart}
                        className="
                            font-mono text-sm md:text-base tracking-[0.4em] uppercase
                            text-foreground border border-foreground/40 px-10 py-5
                            hover:bg-foreground/10 transition-colors duration-300
                        "
                    >
                        Start →
                    </button>
                </div>
            )}

            {isRunning && (
                <div className="absolute bottom-[8%] left-0 right-0 z-10 flex flex-col items-center gap-2">
                    <span
                        className={`font-mono text-[11px] md:text-[13px] tracking-[0.3em] uppercase ${
                            isDone ? "text-red-400/80" : "text-white/45"
                        }`}
                    >
                        {isDone ? "Time's up" : "4-hour challenge countdown"}
                    </span>
                    <button
                        onClick={handleReset}
                        className="font-mono text-[9px] text-white/25 hover:text-white/50 tracking-[0.2em] uppercase transition-colors duration-300"
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}
