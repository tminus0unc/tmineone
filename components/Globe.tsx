"use client";

import { useEffect, useRef } from "react";
import styles from "./Globe.module.css";

/**
 * Realistic Earth with:
 * - Continuous slow auto-rotation
 * - Click+drag to spin interactively; momentum decays back to idle pace
 */
export default function Globe() {
  const mapRef   = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef(0);

  useEffect(() => {
    const map    = mapRef.current;
    const planet = planetRef.current;
    if (!map || !planet) return;

    const IDLE_SPEED_PER_MS = 1 / (90 * 1000); // fraction per ms (1 rev / 90s)

    let pos        = 0;     // 0..1 (fraction of one full revolution)
    let vel        = IDLE_SPEED_PER_MS;
    let last       = performance.now();
    let dragging   = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let lastDragX  = 0;
    let lastDragT  = 0;
    let dragVel    = 0;     // velocity while dragging (fraction / ms)

    const applyPos = () => {
      const imgW = map.offsetWidth * 2; // 2:1 equirectangular
      map.style.backgroundPositionX = `${-(pos * imgW)}px`;
    };

    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      if (!dragging) {
        // Ease velocity back toward idle
        vel += (IDLE_SPEED_PER_MS - vel) * 0.018;
        pos  = (pos + vel * dt + 1) % 1;
        applyPos();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // ── pointer events ────────────────────────────────────────────────────────
    const onDown = (e: PointerEvent) => {
      dragging     = true;
      dragStartX   = e.clientX;
      dragStartPos = pos;
      lastDragX    = e.clientX;
      lastDragT    = performance.now();
      dragVel      = 0;
      planet.setPointerCapture(e.pointerId);
      planet.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now   = performance.now();
      const dt    = now - lastDragT;
      const imgW  = map.offsetWidth * 2;
      const delta = e.clientX - dragStartX;

      // Convert pixel delta to revolution fraction
      pos = ((dragStartPos - delta / imgW) + 1) % 1;
      applyPos();

      if (dt > 0) dragVel = -(e.clientX - lastDragX) / imgW / dt;
      lastDragX = e.clientX;
      lastDragT = now;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      // Kick the auto-rotation with the drag momentum, then it decays to idle
      vel = dragVel !== 0 ? Math.max(dragVel, IDLE_SPEED_PER_MS * 0.1) : IDLE_SPEED_PER_MS;
      planet.style.cursor = "grab";
    };

    planet.addEventListener("pointerdown", onDown);
    planet.addEventListener("pointermove", onMove);
    planet.addEventListener("pointerup",   onUp);
    planet.addEventListener("pointercancel", onUp);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      planet.removeEventListener("pointerdown", onDown);
      planet.removeEventListener("pointermove", onMove);
      planet.removeEventListener("pointerup",   onUp);
      planet.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className={styles.viewport}>
      <div ref={planetRef} className={styles.planet} style={{ cursor: "grab" }}>
        <div ref={mapRef} className={styles.map} />
        <div className={styles.tint} />
        <div className={styles.tintGlow} />
        <div className={styles.shading} />
        <div className={styles.rim} />
      </div>
    </div>
  );
}
