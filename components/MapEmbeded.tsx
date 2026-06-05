"use client";

import { useEffect, useRef } from "react";

export default function MapEmbed() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (mapInstanceRef.current || !mapRef.current) return;

        import("leaflet").then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current!, {
                center: [40.7128, -74.006],
                zoom: 14,
                scrollWheelZoom: false,
                zoomControl: true,
            });

            L.tileLayer(
                `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY}`,
                {
                    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
                    maxZoom: 20,
                }
            ).addTo(map);

            L.marker([40.7128, -74.006])
                .addTo(map)
                .bindPopup(
                    `<div style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">
            T-0 · New York City
          </div>`
                );

            mapInstanceRef.current = map;
        });

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    return (
        <div className="flex-1 flex flex-col gap-4 h-[78vh] px-8 py-3">

            {/* Map */}
            <div
                ref={mapRef}
                className="flex-1 border border-foreground/20 outline-none"
                style={{ minHeight: 0 }}
            />

            {/* Metadata strip */}
            <div className="font-mono text-foreground/80 tracking-[0.2em] uppercase flex-shrink-0 text-left flex flex-wrap gap-x-6 gap-y-1 text-[10px] md:text-xs">
                <span>VENUE: TBD</span>
                <span>DATE: FALL 2026</span>
                <span>COORDS: 40.7128° N, 74.0060° W</span>
            </div>

            <style>{`
        .leaflet-container:focus {
          outline: none !important;
        }
        .leaflet-container {
          background: #0a0a0a;
        }
      `}</style>
        </div>
    );
}