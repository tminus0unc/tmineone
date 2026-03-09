"use client";

import Timer from "@/components/Timer";
import ScrollDownButton from "@/components/Scroller";
import "./globals.css";
import GlitchSlices from "@/components/Glitcher";


export default function Home() {
    return (
        <>
            {/* First screen */}
            <div className="font-timer flex min-h-screen items-center justify-center relative italic">
                <Timer className=" text-[10vw]" />
                <ScrollDownButton />

            </div>

            {/* Section below */}
            <div
                id="next-section"
                className="min-h-screen justify-left pl-10 md:pl-20 gap-5"
            >

                <GlitchSlices text={"Who are we"}/><br/>

                <GlitchSlices text={"What do we do"}/> <br/>

                <GlitchSlices text={"When and Where"}/> <br/>

                <GlitchSlices text={"Why are we doing this"}/> <br/>

            </div>
        </>
    );
}