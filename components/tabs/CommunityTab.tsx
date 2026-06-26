"use client";

import FolderSection from "@/components/FolderSection";

export default function CommunityTab({ totalTabs }: { totalTabs: number }) {
  return (
    <FolderSection title="Community" index={9} color="bg-background" tab={9} totalTabs={totalTabs}>
      <div className="relative flex-1 -mx-4 md:-mx-10 overflow-hidden">
        <img
          src="/assets/t-0%20team%20photo.JPG"
          alt="The T-0 team"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.7) contrast(1.05) saturate(0.82)" }}
        />

        <div
          className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,17,21,0.94) 0%, rgba(12,17,21,0.55) 45%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(12,17,21,0.92) 0%, rgba(12,17,21,0.65) 40%, transparent 100%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 px-8 md:px-20 pt-10 md:pt-16">
          <p className="font-mono text-[10px] md:text-[11px] text-foreground tracking-[0.45em] uppercase mb-4 opacity-80">
            T-MINUS ZERO · CHAPEL HILL
          </p>
          <h2
            className="font-timer font-light text-3xl md:text-5xl leading-[1.15] max-w-3xl"
            style={{ color: "#f0f4f8" }}
          >
            Join us at UNC&apos;s most ambitious startup community.
          </h2>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-8 md:px-16 pb-7 flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[9px] md:text-[10px] text-white/45 tracking-[0.25em] uppercase">
              Copyright &copy; Tminus0 2026
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://linkedin.com/company/tminus0/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/tminus0.unc/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a
                href="mailto:tminus0.unc@gmail.com"
                aria-label="Email"
                className="text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="2,4 12,13 22,4"/>
                </svg>
              </a>
            </div>
            <p className="font-mono text-[8px] md:text-[9px] text-white/30 tracking-[0.15em]">
              Have questions? Contact us at{" "}
              <a href="mailto:tminus0.unc@gmail.com" className="text-foreground/60 hover:text-foreground transition-colors duration-200">
                tminus0.unc@gmail.com
              </a>
            </p>
          </div>

          <img
            src="/icon.svg"
            alt="Tminus0"
            className="w-32 h-32 md:w-40 md:h-40 select-none flex-shrink-0"
            style={{ mixBlendMode: "screen", opacity: 0.9 }}
          />
        </div>
      </div>
    </FolderSection>
  );
}
