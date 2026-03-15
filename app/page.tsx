"use client";

import Timer from "@/components/Timer";
import ScrollDownButton from "@/components/Scroller";
import "./globals.css";
import React from "react";


export default function Home() {
    return (
        <>
            {/* First screen */}
            <div className="font-timer flex min-h-screen items-center justify-center relative italic">
                <Timer className=" text-[10vw]"/>
                <ScrollDownButton/>

            </div>

            {/* Section below */}
            <div
                id = "next-section"
                className="min-h-screen flex flex-col p-6">

                {/* Text */}
                <div className="flex-grow flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">Our Location</h2>
                    <p>123 Main Street</p>
                    <p>Raleigh, NC</p>
                </div>

                {/* Map (always bottom) */}
                <div className="w-full h-[40vh] overflow-hidden rounded-xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=..."
                        className="w-full h-full border-0"
                        loading="lazy"
                    />
                </div>

            </div>
        </>
    );
}