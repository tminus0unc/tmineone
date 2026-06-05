"use client";

import { useEffect, useRef, useCallback } from "react";

let leafletCSSLoaded = false;

export default function MapEmbed() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    const initMap = useCallback(() => {
        if (!mapRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
        const container = mapRef.current as any;
        if (container._leaflet_id) {
            container._leaflet_id = null;
        }

        if (!leafletCSSLoaded) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
            leafletCSSLoaded = true;
        }

        import("leaflet").then((L) => {
            if (!mapRef.current) return;

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current, {
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
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    initMap();
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(mapRef.current);

        return () => {
            observer.disconnect();
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
    }, [initMap]);

    return (
        <div className="flex flex-col gap-4 h-full px-8 py-3">
            <div
                ref={mapRef}
                className="flex-1 border border-foreground/20 outline-none min-h-0"
                style={{ height: "100%" }}
            />

            <div className="font-mono text-foreground/80 tracking-[0.2em] uppercase flex-shrink-0 text-left flex flex-wrap gap-x-6 gap-y-1 text-[10px] md:text-xs">
                <span>VENUE: TBD</span>
                <span>DATE: FALL 2026</span>
                <span>COORDS: 40.7128° N, 74.0060° W</span>
            </div>

            <style>{`
                .leaflet-container:focus { outline: none !important; }
                .leaflet-container { background: #0a0a0a; height: 100% !important; }
            `}</style>
        </div>
    );
}