import React from "react";
import styles from "./Glitcher.module.css"
import GlitchChar from "./CharGlitcher";

export default function GlitchText({ text }: { text: string }) {

    return (
        <div className={styles.wrapper}>
            { text.split("").map((char, i) => (
                <GlitchChar
                    key={i}
                    char={char === " " ? "\u00A0" : char}
                />
            ))}
        </div>
    );

}