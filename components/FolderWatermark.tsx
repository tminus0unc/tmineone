// components/FolderWatermark.tsx
export default function FolderWatermark({
    label,
    opacity = 0.03,
}: {
    label: string;
    opacity?: number;
}) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex items-center justify-center z-0">
            <p
                className="text-[7rem] font-bold uppercase tracking-[0.3em] rotate-[-20deg] whitespace-nowrap"
                style={{ color: `rgba(255,255,255,${opacity})` }}
            >
                {label}
            </p>
        </div>
    );
}
