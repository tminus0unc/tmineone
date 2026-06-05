// components/FolderTabs.tsx
"use client";

type Tab = {
    title: string;
    tab: number;
    index: number;
};

type Props = {
    tabs: Tab[];
};

export default function FolderTabs({ tabs }: Props) {
    return (
        <div className="fixed top-0 left-0 w-full z-[999] pointer-events-none">
            {tabs.map(({ title, tab, index }) => {
                const paddedIndex = String(index).padStart(2, "0");
                return (
                    <div
                        key={title}
                        onClick={() =>
                            document.getElementById(title)?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="
              absolute top-0
              h-[5vh] w-[20vw] rounded-t-[12px]
              flex items-center justify-between px-2 md:px-4
              border-2 border-foreground border-b-0
              bg-background cursor-pointer
              transition-opacity duration-200 hover:opacity-70
              pointer-events-auto
            "
                        style={{
                            left: `${(tab - 1) * 20}vw`,
                        }}
                    >
                        {/* Mobile: just number */}
                        <span className="md:hidden font-mono text-[9px] text-white/60 tracking-[0.1em] w-full text-center">
              {paddedIndex}
            </span>

                        {/* Desktop: full label */}
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
                );
            })}
        </div>
    );
}