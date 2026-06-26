"use client";

type Props = {
  title: string;
  children: React.ReactNode;
  index: number;
  tab: number;
  color: string;
  /** Total number of tabs, used to size each tab evenly across the top. */
  totalTabs?: number;
};

export default function FolderSection({ title, children, index, tab, totalTabs = 7 }: Props) {
  const paddedIndex = String(index).padStart(2, "0");
  const colW = 100 / totalTabs; // vw per tab

  return (
      <section
          id={title}
          className="h-screen snap-start"
          style={{ zIndex: index + 10, position: "sticky", top: 0 }}
      >
        {/* TAB */}
        <div
            onClick={() => {
              const scrollEl = document.querySelector("main") as HTMLElement | null;
              if (scrollEl) scrollEl.scrollTo({ top: (index - 1) * scrollEl.clientHeight, behavior: "smooth" });
            }}
            className="
          h-[5vh] rounded-t-[12px]
          flex items-center justify-between px-2 md:px-4
          border-2 border-foreground border-b-0
          relative z-10 bg-background
          cursor-pointer transition-opacity duration-200 hover:opacity-70
        "
            style={{
              width: `${colW}vw`,
              marginLeft: `${(tab - 1) * colW}vw`,
              marginBottom: "-2px",
              zIndex: 20,
              paddingBottom: "2px",
            }}
        >
          {/* Mobile */}
          <span className="md:hidden font-mono text-[10px] text-white/60 tracking-[0.1em] w-full text-center">
          {paddedIndex}
        </span>

          {/* Desktop */}
          <span className="hidden md:flex w-full items-center justify-between">
          <span className="font-mono text-[11px] text-white/40 tracking-[0.2em] uppercase">
            {paddedIndex}
          </span>
          <span className="font-mono text-[11px] text-white/75 tracking-[0.18em] uppercase truncate mx-2">
            {title}
          </span>
        </span>
        </div>

        {/* BODY */}
        <div className="relative h-screen overflow-hidden flex flex-col bg-background border-t border-foreground/20">
          {/* Subtle depth vignette */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          <div className="relative z-[1] px-4 md:px-10 flex-1 flex flex-col min-h-0">{children}</div>
        </div>
      </section>
  );
}
