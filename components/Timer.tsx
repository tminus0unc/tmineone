'use client';

import React, { useState, useEffect } from 'react';
import GlitchText from "@/components/Glitcher";

type TimerProps = {
    className?: string;
};

export default function Timer({ className }: TimerProps) {
    const targetDate = new Date("Apr 11, 2026 04:00:00").getTime();

    const [countdown, setCountdown] =
        useState(targetDate - Date.now());

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

    return (
        <div className="flex items-center justify-center h-[80vw] w-full">
            <div
                className={`
                    glitch
                    text-[8vw]
                    text-black
                    font-bold
                    leading-none
                    ${className || ""}
                `}
            >
                <GlitchText
                    text={`${days}d ${hours}h ${minutes}m ${seconds}s`}
                />
            </div>
        </div>
    );
}