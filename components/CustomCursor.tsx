"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ willChange: "transform" }}
    >
      {/* outer ring */}
      <div
        className="absolute rounded-full border border-white/70"
        style={{
          width: 16,
          height: 16,
          top: -8,
          left: -8,
        }}
      />
      {/* center dot */}
      <div
        className="absolute rounded-full bg-white/80"
        style={{
          width: 3,
          height: 3,
          top: -1.5,
          left: -1.5,
        }}
      />
    </div>
  );
}
