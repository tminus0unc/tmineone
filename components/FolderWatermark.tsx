// components/FolderWatermark.tsx
export default function FolderWatermark({ label }: { label: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex items-center justify-center">
            <p
                className="
          text-[12rem] font-bold uppercase tracking-[0.3em]
          text-white/[0.03] rotate-[-20deg] whitespace-nowrap
        "
            >
                {label}
            </p>
        </div>
    );
}