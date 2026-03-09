"use client";

export default function ScrollDownButton() {
    const scrollDown = () => {
        document.getElementById("next-section")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollDown}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 "
        >
            <p className="text-[4vh] animate-bounce [animation-duration:3s]">
                ⌄
            </p>
        </button>
    );
}