"use client";

import { useMemo, useRef, useState } from "react";
import type { TeamSeries } from "@/lib/moneyTrackerMath";
import { formatCurrency } from "@/lib/format";

const VB_W = 1000;
const VB_H = 420;
const PAD = { left: 64, right: 132, top: 16, bottom: 36 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;
const LABEL_MIN_GAP = 20;

function niceNumber(value: number): number {
  if (value <= 0) return 100;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * Math.pow(10, exponent);
}

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function valueAtTime(series: TeamSeries, time: number): number {
  let value = 0;
  for (const p of series.points) {
    if (p.time > time) break;
    value = p.value;
  }
  return value;
}

export default function RaisedOverTimeChart({ series }: { series: TeamSeries[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const { minTime, maxTime, niceMax, allTimes } = useMemo(() => {
    const times = series.flatMap((s) => s.points.map((p) => p.time));
    const values = series.flatMap((s) => s.points.map((p) => p.value));
    const min = times.length ? Math.min(...times) : Date.now();
    const max = times.length ? Math.max(...times) : Date.now() + 1;
    const maxVal = values.length ? Math.max(...values) : 0;
    return {
      minTime: min,
      maxTime: max > min ? max : min + 1,
      niceMax: niceNumber(maxVal * 1.15),
      allTimes: Array.from(new Set(times)).sort((a, b) => a - b),
    };
  }, [series]);

  const x = (time: number) => PAD.left + ((time - minTime) / (maxTime - minTime)) * PLOT_W;
  const y = (value: number) => PAD.top + PLOT_H - (value / niceMax) * PLOT_H;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => niceMax * f);

  const paths = useMemo(
    () =>
      series.map((s) => {
        const pts = s.points;
        let d = `M ${x(pts[0].time)} ${y(pts[0].value)}`;
        for (let i = 1; i < pts.length; i++) {
          d += ` L ${x(pts[i].time)} ${y(pts[i - 1].value)} L ${x(pts[i].time)} ${y(pts[i].value)}`;
        }
        return { team: s.team, color: s.color, d, total: s.total };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, minTime, maxTime, niceMax]
  );

  // Direct end-labels: only when a label clears a minimum vertical gap from
  // its neighbor, otherwise skip it — the legend + tooltip carry the rest.
  const endLabels = useMemo(() => {
    const byValue = [...series].sort((a, b) => b.total - a.total);
    let prevY = -Infinity;
    const shown = new Set<string>();
    for (const s of byValue) {
      const yPos = y(s.total);
      if (yPos - prevY >= LABEL_MIN_GAP) {
        shown.add(s.team);
        prevY = yPos;
      }
    }
    return shown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, niceMax]);

  function handleMove(e: React.MouseEvent<SVGRectElement>) {
    const svg = svgRef.current;
    if (!svg || allTimes.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * VB_W;
    const time = minTime + ((svgX - PAD.left) / PLOT_W) * (maxTime - minTime);
    let nearest = allTimes[0];
    let best = Infinity;
    for (const t of allTimes) {
      const dist = Math.abs(t - time);
      if (dist < best) {
        best = dist;
        nearest = t;
      }
    }
    setHoverTime(nearest);
  }

  const hoverRows = hoverTime === null ? null : series.map((s) => ({ team: s.team, color: s.color, value: valueAtTime(s, hoverTime) })).sort((a, b) => b.value - a.value);
  const hoverXPct = hoverTime === null ? 0 : (x(hoverTime) / VB_W) * 100;
  const tooltipOnRight = hoverXPct < 62;

  return (
    <div className="w-full">
      <div className="relative w-full">
        <svg ref={svgRef} viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto block" onMouseLeave={() => setHoverTime(null)}>
          {/* gridlines */}
          {yTicks.map((t) => (
            <line key={t} x1={PAD.left} x2={VB_W - PAD.right} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          ))}
          <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={VB_H - PAD.bottom} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
          <line x1={PAD.left} x2={VB_W - PAD.right} y1={VB_H - PAD.bottom} y2={VB_H - PAD.bottom} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />

          {/* y axis labels */}
          {yTicks.map((t) => (
            <text key={t} x={PAD.left - 10} y={y(t) + 4} textAnchor="end" className="fill-white/40" fontSize={12} fontFamily="var(--font-info)">
              {formatCurrency(t)}
            </text>
          ))}

          {/* x axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => {
            const t = minTime + (maxTime - minTime) * f;
            return (
              <text key={f} x={x(t)} y={VB_H - PAD.bottom + 20} textAnchor="middle" className="fill-white/40" fontSize={11} fontFamily="var(--font-info)">
                {formatTime(t)}
              </text>
            );
          })}

          {/* lines */}
          {paths.map((p) => (
            <path key={p.team} d={p.d} fill="none" stroke={p.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}

          {/* end markers + direct labels */}
          {series.map((s) => {
            const last = s.points[s.points.length - 1];
            const cy = y(last.value);
            const cx = x(last.time);
            return (
              <g key={s.team}>
                <circle cx={cx} cy={cy} r={6} fill="#0c1115" />
                <circle cx={cx} cy={cy} r={4} fill={s.color} />
                {endLabels.has(s.team) && (
                  <text x={cx + 12} y={cy + 4} fontSize={12} fontFamily="var(--font-info)" className="fill-white/70">
                    {s.team}
                  </text>
                )}
              </g>
            );
          })}

          {/* crosshair */}
          {hoverTime !== null && (
            <>
              <line x1={x(hoverTime)} x2={x(hoverTime)} y1={PAD.top} y2={VB_H - PAD.bottom} stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
              {series.map((s) => (
                <circle key={s.team} cx={x(hoverTime)} cy={y(valueAtTime(s, hoverTime))} r={5} fill={s.color} stroke="#0c1115" strokeWidth={2} />
              ))}
            </>
          )}

          {/* hover hit area */}
          <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} fill="transparent" onMouseMove={handleMove} />
        </svg>

        {hoverRows && (
          <div
            className="absolute top-2 z-10 min-w-[160px] bg-[#0c1115] border border-white/15 px-3 py-2 pointer-events-none"
            style={tooltipOnRight ? { left: `${hoverXPct}%`, marginLeft: 16 } : { right: `${100 - hoverXPct}%`, marginRight: 16 }}
          >
            <p className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase mb-1.5">{formatTime(hoverTime!)}</p>
            <ul className="space-y-1">
              {hoverRows.map((r) => (
                <li key={r.team} className="flex items-center justify-between gap-4 text-[12px]">
                  <span className="flex items-center gap-1.5 text-white/60 truncate">
                    <span className="inline-block w-2.5 h-0.5" style={{ backgroundColor: r.color }} />
                    {r.team}
                  </span>
                  <span className="font-semibold text-white/90 tabular-nums">{formatCurrency(r.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-white/10">
        {[...series]
          .sort((a, b) => b.total - a.total)
          .map((s) => (
            <div key={s.team} className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: s.color }} />
              <span className="text-white/60">{s.team}</span>
              <span className="text-white/90 tabular-nums">{formatCurrency(s.total)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
