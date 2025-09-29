// components/ui/SiteShell.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ProgressCircle from "./ProgressCircle";

const FEATHER_ACCENT = { hex: "#B79C7B", rgb: "183,156,123" };

const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160' preserveAspectRatio='none'>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter>
    <rect x='-1' y='-1' width='162' height='162' filter='url(#n)' opacity='0.6'/>
  </svg>`
)}")`;

export default function SiteShell() {
  return (
    <main
      id="top"
      // Sticky footer + capas ordenadas
      className="
        relative min-h-svh flex flex-col
        text-neutral-100 antialiased
        pt-[68px] md:pt-[80px]      /* espacio por HEADER fijo */
        overflow-x-hidden          /* evita desbordes en mobile */
      "
      style={{
        ["--accent"]: FEATHER_ACCENT.hex,
        ["--accent-rgb"]: FEATHER_ACCENT.rgb,
        background: "var(--page-bg, #0a0b0e)",
        isolation: "isolate",
      }}
    >
      {/* Ruido de fondo (capa más baja) */}
      <div
        aria-hidden
        className="pointer-events-none fixed -inset-px z-0"
        style={{
          backgroundImage: NOISE_BG,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
          opacity: 0.06,
        }}
      />

      {/* Header fijo, forzamos z alto para estar encima del overlay */}
      <Header
        className="z-[90]"
        brand="737LAB"
        links={[
          { label: "Marcas", href: "/#brands" },
          { label: "Nosotros", href: "/#about" },
        ]}
        fixed
      />
      
      {/* Overlay de progreso: lo ponemos en z-40 y sin interacciones */}
      {/* <div className="fixed inset-0 z-[80] pointer-events-none " >
        <ProgressCircle placement="overlay" />
      </div> */}

      {/* Contenido */}
      <div className="relative z-10 flex-1">
        <Outlet />
      </div>

      {/* Footer (no fixed) */}
      <Footer />
    </main>
  );
}
