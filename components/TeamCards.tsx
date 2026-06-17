"use client";

import { useRef, useState, useEffect } from "react";

const team = [
  {
    name: "Yashasree Gadipalli",
    role: "President, Co-Founder",
    hometown: "Cary, NC",
    majors: ["Data Science", "Business Administration"],
    minors: ["Astronomy"],
    quote: "I'm excited to help build a culture of creativity, problem-solving, and execution at UNC through startup-inspired challenges.",
    image: "/assets/yashasree.jpg",
    file: "FILE-001",
  },
  {
    name: "Julian Fernandez",
    role: "Director of Marketing",
    hometown: "Wake Forest, NC",
    majors: ["Advertising/Public Relations", "Business Administration"],
    minors: ["PPE (Philosophy, Politics, Economics)"],
    quote: "The T-0 concept drew me in immediately for its need at UNC.",
    image: "/assets/julian.jpg",
    file: "FILE-002",
  },
  {
    name: "Bergan Osborne",
    role: "Director of Public Relations",
    hometown: "Greenville, NC",
    majors: ["Business Administration", "Global Studies"],
    minors: [],
    quote: "The combination of teamwork and competition immediately caught my attention when I discovered T-0.",
    image: "/assets/bergan.jpg",
    file: "FILE-003",
  },
  {
    name: "Pam Morales",
    role: "Director of Public Relations",
    hometown: "Wilmington, NC",
    majors: ["Business Administration"],
    minors: ["Entrepreneurship"],
    quote: "T-0 excites me because it brings together driven and spontaneous individuals who are eager to make an impact at UNC.",
    image: "/assets/pam.jpg",
    file: "FILE-004",
  },
  {
    name: "Shom Tailor",
    role: "Director of Technology & Operations",
    hometown: "Holly Springs, NC",
    majors: ["Computer Science", "Linguistics"],
    minors: [],
    quote: "T-0 drew me in cause of how interesting the events sounded.",
    image: "/assets/shom.jpg",
    file: "FILE-005",
  },
  {
    name: "Sara Gulabani",
    role: "Director of Design & Experience",
    hometown: "Cary, NC",
    majors: ["Data Science"],
    minors: ["Business Administration"],
    quote: "T-0 will really help students apply and strengthen their entrepreneurial skills.",
    image: "/assets/saraa.jpg",
    file: "FILE-006",
  },
  {
    name: "Mallory Lawson",
    role: "Director of Logistics",
    hometown: "Cary, NC",
    majors: ["Business Administration"],
    minors: ["PPE (Philosophy, Politics, Economics)"],
    quote: "T-0 is a great opportunity for anyone looking to build their entrepreneurial mindset.",
    image: "/assets/mallory.png",
    file: "FILE-007",
  },
  {
    name: "Amelia Hill",
    role: "Director of Finance",
    hometown: "Chapel Hill, NC",
    majors: ["Business Administration", "Spanish for Business"],
    minors: ["Data Science"],
    quote: "I'm excited to bring a global perspective and creative ideas to T-0!",
    image: "/assets/amelia.jpeg",
    file: "FILE-008",
  },
  {
    name: "Ishani Gandi",
    role: "Director of Sponsorships",
    hometown: "Dallas, TX",
    majors: ["Health Policy and Management"],
    minors: [],
    quote: "I'm inspired by T-0's message: that any student can build anything.",
    image: "/assets/ishani.jpg",
    file: "FILE-009",
  },
  {
    name: "Amy Gao",
    role: "Co-Founder",
    hometown: "Denver, CO",
    majors: ["Economics"],
    minors: ["Education"],
    quote: "Startup founder or not, anyone could gain from building something live, real, and with peers.",
    image: "/assets/amyy.jpg",
    file: "FILE-010",
  },
];

export default function TeamCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [collapsedW, setCollapsedW] = useState(0);
  const [expandedW, setExpandedW] = useState(240);

  useEffect(() => {
    const calc = () => {
      const totalW = containerRef.current?.clientWidth ?? window.innerWidth;
      const exp = Math.min(280, Math.floor(totalW * 0.28));
      const col = Math.floor((totalW - exp) / (team.length - 1));
      setExpandedW(exp);
      setCollapsedW(Math.max(col, 32));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-4 pb-4 md:pt-6 md:pb-6 flex-shrink-0 flex items-end justify-between border-b border-foreground/20">
          <div>
            <p className="font-mono text-[10px] md:text-[11px] text-foreground/40 tracking-[0.4em] uppercase mb-1">
              FILE: PERSONNEL · {team.length} RECORDS
            </p>
            <h2 className="text-lg md:text-2xl font-bold text-white">Meet the team.</h2>
          </div>
          <p className="font-mono text-[10px] md:text-[11px] text-foreground/40 tracking-[0.2em] uppercase">
            {activeIndex !== null ? `OPEN: ${team[activeIndex].file}` : "HOVER A FILE"}
          </p>
        </div>

        {/* Card row */}
        <div
            ref={containerRef}
            className="flex-1 flex overflow-hidden mx-6 my-4 md:my-6"
        >
          {collapsedW > 0 && team.map((member, i) => {
            const isActive = activeIndex === i;
            const initials = member.name.split(" ").map(n => n[0]).join("");
            const w = isActive ? expandedW : collapsedW;

            return (
                <div
                    key={member.name}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className="relative flex-shrink-0 flex flex-col border-r border-foreground/20 bg-background cursor-pointer transition-all duration-300 overflow-hidden"
                    style={{
                      width: `${w}px`,
                      borderLeft: i === 0 ? "1px solid rgba(255,255,255,0.12)" : undefined,
                      boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.1), 4px 0 20px rgba(0,0,0,0.5)" : "none",
                    }}
                >
                  {/* Collapsed */}
                  {!isActive && (
                      <div className="flex flex-col h-full items-center justify-between py-5 px-1">
                  <span className="font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.15em] uppercase">
                    {member.file.replace("FILE-", "")}
                  </span>
                        <div
                            className="flex-1 flex items-center justify-center overflow-hidden"
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", maxHeight: "60%" }}
                        >
                    <span className="font-mono text-[10px] md:text-[12px] text-white tracking-[0.15em] uppercase truncate">
                      {member.name.split(" ")[0]}
                    </span>
                        </div>
                        <span className="font-mono text-[9px] md:text-[10px] font-bold text-foreground/35 tracking-widest">
                    {initials}
                  </span>
                      </div>
                  )}

                  {/* Expanded */}
                  {isActive && (
                      <div className="flex flex-col h-full">
                        {/* Photo */}
                        <div
                            className="w-full flex-shrink-0 relative bg-foreground/5 border-b border-foreground/20"
                            style={{ height: "40%" }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-4xl font-bold text-foreground/15 tracking-widest">
                        {initials}
                      </span>
                          </div>
                          <img
                              src={member.image}
                              alt={member.name}
                              draggable={false}
                              className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="absolute top-2 left-2 font-mono text-[9px] md:text-[10px] text-foreground/60 tracking-[0.2em] bg-background/80 px-1.5 py-0.5 uppercase">
                            {member.file}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col flex-1 p-3 gap-2 overflow-hidden">
                          <div>
                            <p className="font-mono text-sm md:text-base font-bold text-white tracking-[0.1em] uppercase leading-tight truncate">
                              {member.name}
                            </p>
                            <p className="font-mono text-[10px] md:text-[12px] text-foreground/60 tracking-[0.08em] uppercase mt-0.5 leading-tight">
                              {member.role}
                            </p>
                          </div>

                          <div className="w-full h-px bg-foreground/20 flex-shrink-0" />

                          <div className="space-y-2 overflow-hidden flex-1">
                            <div>
                              <p className="font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.3em] uppercase">ORIGIN</p>
                              <p className="font-mono text-[11px] md:text-[13px] text-foreground/80 mt-0.5">{member.hometown}</p>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.3em] uppercase">FIELD</p>
                              <p className="font-mono text-[11px] md:text-[13px] text-foreground/80 mt-0.5 leading-tight">{member.majors.join(", ")}</p>
                            </div>
                            {member.minors.length > 0 && (
                                <div>
                                  <p className="font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.3em] uppercase">MINOR</p>
                                  <p className="font-mono text-[11px] md:text-[13px] text-foreground/80 mt-0.5">{member.minors.join(", ")}</p>
                                </div>
                            )}
                            <div>
                              <p className="font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.3em] uppercase">STATEMENT</p>
                              <p className="font-mono text-[10px] md:text-[11px] text-foreground/60 mt-0.5 leading-relaxed italic line-clamp-4">
                                "{member.quote}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-1 border-t border-foreground/20 flex-shrink-0">
                          <p className="font-mono text-[9px] md:text-[10px] text-foreground/35 tracking-[0.2em] uppercase">
                            STATUS: ACTIVE · CLEARANCE: PUBLIC
                          </p>
                        </div>
                      </div>
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
}