"use client";

import { useEffect, useRef } from "react";

export default function MouseSphere() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -999, y: -999 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const parent = canvas.parentElement!;

        const GRID = 48;
        const RADIUS = 180;
        const COLOR = "0,176,255";

        const resize = () => {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        };

        const onMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        };

        const onLeave = () => {
            mouseRef.current = { x: -999, y: -999 };
        };

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            const { x, y } = mouseRef.current;
            ctx.clearRect(0, 0, W, H);

            if (x >= 0) {
                ctx.lineWidth = 0.5;
                const cols = Math.ceil(W / GRID) + 1;
                const rows = Math.ceil(H / GRID) + 1;

                for (let i = 0; i < cols; i++) {
                    const gx = i * GRID;
                    for (let seg = 0; seg < rows - 1; seg++) {
                        const y0 = seg * GRID, y1 = y0 + GRID;
                        const my = (y0 + y1) / 2;
                        const dx = gx - x, dy = my - y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > RADIUS) continue;
                        const t = 1 - dist / RADIUS;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${COLOR},${t * 0.6})`;
                        ctx.moveTo(gx, y0);
                        ctx.lineTo(gx, y1);
                        ctx.stroke();
                    }
                }

                for (let j = 0; j < rows; j++) {
                    const gy = j * GRID;
                    for (let seg = 0; seg < cols - 1; seg++) {
                        const x0 = seg * GRID, x1 = x0 + GRID;
                        const mx = (x0 + x1) / 2;
                        const dx = mx - x, dy = gy - y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > RADIUS) continue;
                        const t = 1 - dist / RADIUS;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${COLOR},${t * 0.6})`;
                        ctx.moveTo(x0, gy);
                        ctx.lineTo(x1, gy);
                        ctx.stroke();
                    }
                }
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);
        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}