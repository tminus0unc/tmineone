'use client';

import React, { useState, useEffect } from 'react';
import Globe from "@/components/Globe";

type TimerProps = {
    className?: string;
};

export default function Timer({ className }: TimerProps) {
    const targetDate = new Date("Sept 19, 2026 04:00:00").getTime();

    const [countdown, setCountdown] = useState(targetDate - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(targetDate - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const totalSeconds = Math.max(0, Math.floor(countdown / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const units = [
        { value: days, label: "Days" },
        { value: hours, label: "Hours" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Seconds" },
    ];

    return (
        <div className={`relative flex-1 w-full h-full ${className || ""}`}>
            {/* Realistic rotating Earth, centered behind the digits */}
            <Globe />

            {/* Countdown grid — fills the full container height */}
            <div className="relative z-10 h-full grid grid-cols-4">
                {units.map(({ value, label }) => (
                    <div
                        key={label}
                        className="
                            group relative flex flex-col items-center justify-center
                            border-l border-white/10 first:border-l-0
                            transition-colors duration-500
                        "
                    >
                        {/* Faint blue glow on hover */}
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
                                text-[12vw] tracking-[-0.02em]
                                drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]
                            "
                            style={{ color: "#f0f4f8" }}
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

            {/* Subtitle — absolute so it never overlaps the earth or the scroll arrow */}
            <div className="absolute bottom-[8%] left-0 right-0 text-center z-10 pointer-events-none">
                <span className="font-mono text-[11px] md:text-[13px] text-white/45 tracking-[0.3em] uppercase">
                    North Carolina&apos;s biggest startup challenge
                </span>
            </div>
        </div>
    );
}
