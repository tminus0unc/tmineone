"use client";

import { useState } from "react";
import FolderSection from "@/components/FolderSection";
import MouseSphere from "@/components/MouseSphere";

type FAQItem = { q: string; a: string };
type FAQCategory = { label: string; items: FAQItem[] };

const columns: FAQCategory[][] = [
  [
    {
      label: "General",
      items: [
        {
          q: "What is T-0?",
          a: "T-0 is a time challenge where we give participants a goal and a time limit to reach it. The details remain a surprise until the event begins.",
        },
        {
          q: "Do I need to have a startup idea?",
          a: "No. T-0 isn't about arriving with an idea, but rather about how you think, collaborate, and execute under time pressure.",
        },
        {
          q: "Do I need business or technical experience?",
          a: "Not at all. Strong teams need many different ways of thinking. Whether your background is business, engineering, design, science, or something completely different, you'll have something valuable to contribute.",
        },
        {
          q: "Will there be future T-0 events?",
          a: "Yes. T-0 is more than a single event, we're building a tight-knit community around creativity, execution, and entrepreneurship at UNC.",
        },
      ],
    },
    {
      label: "Eligibility & Teams",
      items: [
        {
          q: "Who is this for?",
          a: "Anyone undergraduate college student who's curious, enjoys solving problems, and wants to challenge themselves. No prior startup experience needed to participate.",
        },
        {
          q: "Can I participate if I'm not from UNC?",
          a: "Yes. Any college student is eligible to participate. If you're a high-schooler, email us at tminus0.unc@gmail.com. We're admitting a small number of exceptional high-schoolers to participate.",
        },
        {
          q: "Will I be placed on a team?",
          a: "Yes. You can register as a team or find a team at the event. We will arrange teams for those who wish to form one prior to the event.",
        },
      ],
    },
  ],
  [
    {
      label: "Logistics",
      items: [
        {
          q: "When is T-0?",
          a: "September 13th, 2026. Stay tuned for a detailed schedule including check-in times!",
        },
        {
          q: "How long is the event?",
          a: "Approximately 7 hours. We will post a detailed schedule soon, so keep an eye on the website!",
        },
        {
          q: "Is there a cost to attend?",
          a: "No. Participation is completely free.",
        },
        {
          q: "Will food be provided?",
          a: "Yes. We will be providing lunch for all participants during the event. A schedule detailing lunch times coming soon.",
        },
        {
          q: "What is the Founder's Dinner?",
          a: "We are organizing an invite-only Founder's Dinner following the challenge with judges, T-0 Exec, and specially invited members. More information on how to get invited coming soon!",
        },
        {
          q: "What should I bring?",
          a: "A laptop, something to take notes with, and your creativity! Snacks will be provided :)",
        },
      ],
    },
    {
      label: "Get Involved",
      items: [
        {
          q: "How do invitations work?",
          a: "Invitations are sent to some UNC students from our network or whose work caught our eye to get first dibs at registration. If you didn't receive one, you can still introduce yourself through our website. We're always looking to meet new builders!",
        },
        {
          q: "How can I be involved if I'm not participating?",
          a: "We're looking for volunteers!!! Please fill out our volunteer form to sign up.",
        },
        {
          q: "I still have questions!",
          a: "Please email us at tminus0.unc@gmail.com if you have any further questions or concerns!",
        },
      ],
    },
  ],
];

function FAQGroup({ category }: { category: FAQCategory }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <p className="font-mono text-[10px] md:text-[11px] text-foreground/60 tracking-[0.4em] uppercase mb-3">
        {category.label}
      </p>
      <div className="border-t border-foreground/15">
        {category.items.map((item, i) => {
          const open = openIdx === i;
          return (
            <div key={item.q} className="border-b border-foreground/15">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-3 text-left group"
              >
                <span className="font-timer font-light text-sm md:text-base text-white/80 group-hover:text-white transition-colors duration-300">
                  {item.q}
                </span>
                <span
                  className="flex-shrink-0 font-mono text-foreground/60 text-sm transition-transform duration-500"
                  style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="font-timer font-light text-xs md:text-sm text-white/55 leading-relaxed pb-4 pr-6">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FAQTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="FAQ" index={5} color="bg-background" tab={5} totalTabs={totalTabs}>
      <MouseSphere />
      <div className="flex-1 flex flex-col min-h-0 px-4 md:px-10 py-6 md:py-8">
        <div className="flex-shrink-0 mb-5 md:mb-6">
          <p className="font-mono text-[9px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-2 opacity-80">
            FILE: FAQ · CLEARANCE: PUBLIC
          </p>
          <h2 className="font-timer font-light text-xl md:text-3xl" style={{ color: "#f0f4f8" }}>
            Frequently asked questions.
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 pb-6">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-8">
                {col.map((category) => (
                  <FAQGroup key={category.label} category={category} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FolderSection>
  );
}
