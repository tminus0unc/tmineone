import type { Metadata } from "next";
import {
  Anta,
  Anton,
  Audiowide,
  Bebas_Neue,
  Berkshire_Swash,
  Black_Ops_One,
  Courier_Prime,
  Exo_2,
  Fragment_Mono,
  Geist,
  Geist_Mono,
  Inconsolata,
  Inter,
  Merriweather,
  Nova_Mono,
  Open_Sans,
  Orbitron,
  Oxanium,
  Poppins,
  Quantico,
  Roboto,
  Saira_Condensed,
  Share_Tech,
  Share_Tech_Mono,
  Space_Mono,
  Teko,
  Turret_Road,
} from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { GeistPixelCircle } from "geist/font/pixel";

const timerFont = Oxanium({
  weight: ["200", "300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-timer",
});

const infoFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-info",
});

export const metadata: Metadata = {
  title: "Tminus0",
  description:
    "UNC's biggest startup challenge where participants are dropped into an unexpected challenge and given limited time to respond, adapt, and execute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;


}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://tiles.stadiamaps.com" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="preload" as="image" href="/assets/yashasree.webp" />
        <link rel="preload" as="image" href="/assets/julian.webp" />
        <link rel="preload" as="image" href="/assets/bergan.webp" />
        <link rel="preload" as="image" href="/assets/pam.webp" />
        <link rel="preload" as="image" href="/assets/shom.webp" />
        <link rel="preload" as="image" href="/assets/sara.webp" />
        <link rel="preload" as="image" href="/assets/mallory.jpg" />
        <link rel="preload" as="image" href="/assets/amelia.webp" />
        <link rel="preload" as="image" href="/assets/ishani.jpg" />
        <link rel="preload" as="image" href="/assets/amyy.webp" />

      </head>
      <body
        className={`${timerFont.variable} ${infoFont.variable} antialiased scroll-smooth`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
