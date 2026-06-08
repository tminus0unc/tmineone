'use client';

import React, { useState, useEffect } from 'react';
import GlitchText from "@/components/Glitcher";

type TimerProps = {
    className?: string;
};

export default function Timer({ className }: TimerProps) {
    const targetDate = new Date("Apr 11, 2026 04:00:00").getTime();

    const [countdown, setCountdown] = useState(targetDate - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(targetDate - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const totalSeconds = Math.floor(countdown / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const units = [
        { value: days, label: "DAYS" },
        { value: hours, label: "HRS" },
        { value: minutes, label: "MIN" },
        { value: seconds, label: "SEC" },
    ];

    return (
        <div className="flex items-center justify-center flex-1 w-full h-full px-6">

            {/* Mobile: stacked, centered */}
            <div className="flex md:hidden flex-col items-center gap-6 w-full">
                {units.map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <div className={`glitch text-[18vw] font-bold leading-none ${className || ""}`}>
                            <GlitchText text={String(value).padStart(2, "0")} />
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.4em] text-foreground/40 uppercase">
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Desktop: single row with labels below */}
            <div className="hidden md:flex items-start justify-center gap-6 w-full">
                {units.map(({ value, label }, i) => (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center gap-2">
                            <div className={`glitch text-[8vw] font-bold leading-none ${className || ""}`}>
                                <GlitchText text={String(value).padStart(2, "0")} />
                            </div>
                            <span className="font-mono text-[11px] tracking-[0.4em] text-foreground/80 uppercase">
                                {label}
                            </span>
                        </div>
                        {i < units.length - 1 && (
                            <span className={`glitch text-[6vw] font-bold text-white leading-none mt-[0.5vw] ${className || ""}`}>
                                <GlitchText text=":" />
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>

        </div>
    );
}