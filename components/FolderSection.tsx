"use client";

type Props = {
  title: string;
  children: React.ReactNode;
  index: number;
  tab: number;
  color: string;
};

export default function FolderSection({
  title,
  children,
  index,
  tab,
  color,
}: Props) {
  const paddedIndex = String(index).padStart(2, "0");

  return (
    <section
      id={title}
      className=" h-screen snap-start"
      style={{ zIndex: index + 10, position: "sticky", top: 0 }}
    >
       {/*TAB*/}
      <div
        onClick={() =>
          document.getElementById(title)?.scrollIntoView({ behavior: "smooth" })
        }
        className="
    h-[5vh] w-[20vw] rounded-t-[12px]
    flex items-center justify-between px-2 md:px-4
    border-2 border-foreground border-b-0
    relative z-10 bg-background
    cursor-pointer transition-opacity duration-200 hover:opacity-70
  "
        style={{
          marginLeft: `${(tab - 1) * 20}vw`,
          marginBottom: "-2px",
          zIndex: 20,
          paddingBottom: "2px",
        }}
      >
         {/*Mobile: just the number*/}
        <span className="md:hidden font-mono text-[9px] text-white/60 tracking-[0.1em] w-full text-center">
          {paddedIndex}
        </span>

         {/*Desktop: full label*/}
        <span className="hidden md:flex w-full items-center justify-between">
          <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">
            {paddedIndex}
          </span>
          <span className="font-mono text-xs text-white/80 tracking-[0.3em] uppercase truncate mx-2">
            {title}
          </span>
          <span className="font-mono text-[10px] text-white/25 tracking-[0.2em]">
            T-0
          </span>
        </span>
      </div>

      {/* BODY */}
      <div
        className="
          h-screen border-2 border-foreground
          overflow-hidden flex flex-col bg-background
          rounded-tr-[12px]
        "
      >
        {/* CONTENT */}
        <div className="px-4 md:px-10 flex-1 flex flex-col">{children}</div>

        {/* FILE METADATA */}
        <div
          className="
          w-full px-4 md:px-10 py-2
          border-t border-foreground/20
          font-mono text-[9px] md:text-[10px] text-white/25
          tracking-[0.2em] md:tracking-[0.3em] uppercase
          flex items-center justify-between
        "
        >
          {/* Mobile: condensed */}
          <span className="md:hidden">FILE {paddedIndex} · T-0 · 2025</span>

          {/* Desktop: full */}
          <span className="hidden md:block">CREATED: 2025</span>
          <span className="hidden md:block">·</span>
          <span className="hidden md:block">STATUS: OPEN</span>
          <span className="hidden md:block">·</span>
          <span className="hidden md:block">CLEARANCE: PUBLIC</span>
          <span className="hidden md:block">·</span>
          <span className="hidden md:block">FILE NO. {paddedIndex}</span>
        </div>
      </div>
    </section>
  );
}
