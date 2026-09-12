"use client";

import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

type ScheduleRow =
  | { time: string; label: string; invite?: boolean }
  | { note: string };

const SCHEDULE: ScheduleRow[] = [
  { time: "9:30 - 10:00 AM", label: "Check-In" },
  { time: "10:00 - 10:30 AM", label: "Introduction & Welcome Keynotes" },
  { time: "10:30 - 10:45 AM", label: "Base44 Workshop" },
  { time: "11:05 - 11:40 AM", label: "Founder Panel (YC, The Residency)" },
  { time: "11:50 AM - 12:00 PM", label: "Challenge Reveal + Rules" },
  { note: "Lunch and refreshments provided" },
  { time: "12:00 - 4:00 PM", label: "Challenge Time" },
  { time: "4:10 - 4:30 PM", label: "Final Presentation Prep" },
  { time: "4:30 - 5:50 PM", label: "Round 1 Judging" },
  { time: "6:00 - 6:15 PM", label: "Final Face-off" },
  { time: "6:25 - 7:00 PM", label: "Awards + Closing + Networking" },
  { time: "7:00 PM", label: "Founder's Dinner", invite: true },
];

export default function ScheduleTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Schedule" index={6} color="bg-background" tab={6} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-8 py-4">
        <h2 className="flex-shrink-0 font-timer font-light text-2xl md:text-4xl tracking-[0.06em] text-white/85 uppercase mb-4 md:mb-6">
          Schedule
        </h2>

        <div className="w-full max-w-xl">
          {SCHEDULE.map((row, i) =>
            "note" in row ? (
              <p
                key={i}
                className="font-mono text-[8px] md:text-[9px] text-white/40 tracking-[0.15em] uppercase text-center py-1.5"
              >
                {row.note}
              </p>
            ) : (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 py-1.5 border-b border-foreground/10 last:border-b-0"
              >
                <span className="font-timer font-light text-xs md:text-sm text-white/80">
                  {row.label}
                  {row.invite && <span className="text-white/45">*</span>}
                </span>
                <span className="flex-shrink-0 font-mono text-[9px] md:text-[10px] text-white/45 tracking-[0.05em] whitespace-nowrap">
                  {row.time}
                </span>
              </div>
            )
          )}
          <p className="font-mono text-xs md:text-sm text-white/40 tracking-[0.1em] pt-3 text-center">
            * invite-only
          </p>
        </div>
      </div>
    </FolderSection>
  );
}
