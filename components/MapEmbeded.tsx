"use client";

import { useEffect, useRef, useCallback } from "react";

let leafletCSSLoaded = false;

const INNOVATE: [number, number] = [35.9135, -79.0549];
const GOOGLE_MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=136+E+Rosemary+St+Chapel+Hill+NC+27514`;

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
    if (container._leaflet_id) container._leaflet_id = null;

    if (!leafletCSSLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
      leafletCSSLoaded = true;
    }

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: INNOVATE,
        zoom: 18,
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: false,
      });

      L.tileLayer(
        `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY}`,
        {
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
          maxZoom: 20,
        },
      ).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="position: relative; width: 0; height: 0;">
            <div style="
              position: absolute;
              width: 48px; height: 48px;
              border: 1px solid rgba(34,211,238,0.3);
              border-radius: 50%;
              top: -24px; left: -24px;
              animation: markerPulse 2s infinite;
            "></div>

            <div style="
              position: absolute;
              width: 8px; height: 8px;
              background: rgba(34,211,238,1);
              border-radius: 50%;
              top: -4px; left: -4px;
              box-shadow: 0 0 12px rgba(34,211,238,0.8);
            "></div>

            <div style="position: absolute; width: 20px; height: 1px; background: rgba(34,211,238,0.6); top: 0; left: -30px;"></div>
            <div style="position: absolute; width: 20px; height: 1px; background: rgba(34,211,238,0.6); top: 0; left: 10px;"></div>
            <div style="position: absolute; width: 1px; height: 20px; background: rgba(34,211,238,0.6); left: 0; top: -30px;"></div>
            <div style="position: absolute; width: 1px; height: 20px; background: rgba(34,211,238,0.6); left: 0; top: 10px;"></div>

            <div style="
              position: absolute;
              top: -42px;
              left: 12px;
              font-family: monospace;
              font-size: 10px;
              letter-spacing: 0.25em;
              text-transform: uppercase;
              color: rgba(34,211,238,0.9);
              background: rgba(8,8,12,0.85);
              border: 1px solid rgba(34,211,238,0.3);
              padding: 3px 8px;
              white-space: nowrap;
            ">Innovate Carolina</div>
          </div>

          <style>
            @keyframes markerPulse {
              0% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.6); opacity: 0.15; }
              100% { transform: scale(1); opacity: 0.6; }
            }
          </style>
        `,
        iconAnchor: [0, 0],
      });

      L.marker(INNOVATE, { icon }).addTo(map);

      // Open Google Maps on any map click
      map.on("click", () => {
        window.open(GOOGLE_MAPS_URL, "_blank");
      });

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
      { threshold: 0.1 },
    );

    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [initMap]);

  return (
    <div className="flex flex-col gap-3 h-full px-8 py-3">
      {/* Clickable map wrapper */}
      <div
        className="flex-1 relative min-h-0 group cursor-pointer"
        onClick={() => window.open(GOOGLE_MAPS_URL, "_blank")}
      >
        <div
          ref={mapRef}
          className="w-full h-full border border-foreground/20 outline-none"
          style={{ pointerEvents: "none" }} // let wrapper handle clicks
        />

        {/* Hover overlay hint */}
        <div
          className="
          absolute inset-0 flex items-end justify-end p-3
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none
        "
        >
          <div
            className="
            font-mono text-[9px] tracking-[0.3em] uppercase
            text-foreground/70 bg-background/80
            border border-foreground/20 px-2 py-1
          "
          >
            OPEN IN MAPS ↗
          </div>
        </div>
      </div>

      {/* Metadata strip */}
      <div
        className="font-mono text-foreground/60 tracking-[0.2em] uppercase flex-shrink-0 text-left flex flex-wrap gap-x-6 gap-y-1 text-[10px] md:text-xs cursor-pointer hover:text-foreground/80 transition-colors duration-200"
        onClick={() => window.open(GOOGLE_MAPS_URL, "_blank")}
      >
        <span>
          <span className="font-bold text-foreground/80">VENUE:</span> 136 E
          ROSEMARY ST, CHAPEL HILL
        </span>
        <span>
          <span className="font-bold text-foreground/80">DATE:</span> FALL 2026
        </span>
        <span>
          <span className="font-bold text-foreground/80">COORDS:</span>
          35.9135° N, 79.0549° W
        </span>
        <span className="text-foreground/30">↗ GET DIRECTIONS</span>
      </div>

      <style>{`
        .leaflet-container:focus { outline: none !important; }
        .leaflet-container { background: #0a0a0a; }
      `}</style>
    </div>
  );
}
