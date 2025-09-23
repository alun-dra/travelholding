// components/ui/SiteShell.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ProgressCircle from "./ProgressCircle";

const FEATHER_ACCENT = { hex: "#B79C7B", rgb: "183,156,123" };

const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter>
    <rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/>
  </svg>`
)}")`;

export default function SiteShell() {
  return (
    <main
      id="top"
      // relative + isolate para crear un contexto propio de capas y que el ruido/mix-blend no contamine fuera
      className="
        relative min-h-svh text-neutral-100 antialiased
        pt-[68px] md:pt-[80px]                      /* espacio por HEADER fijo */
        pb-[calc(64px+env(safe-area-inset-bottom))] /* espacio por FOOTER fijo */
      "
      style={{
        ["--accent"]: FEATHER_ACCENT.hex,
        ["--accent-rgb"]: FEATHER_ACCENT.rgb,
        // cada página puede definir --page-bg; si no, fallback oscuro
        background: "var(--page-bg, #0a0b0e)",
        isolation: "isolate",
      }}
    >
      {/* ruido global al fondo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: NOISE_BG, opacity: 0.06 }}
      />

      {/* Fijos en toda la app */}
      <Header
        brand="737LAB"
        links={[
          { label: "Marcas", href: "/#brands" },
          { label: "Nosotros", href: "/#about" },
        ]}
        fixed
      />

      {/* indicador de scroll (fixed) */}
      <ProgressCircle placement="overlay" />

      {/* Contenido de las páginas por encima del ruido */}
      <div className="relative z-10">
        <Outlet />
      </div>

      {/* Footer fijo con “glass” (si usas mi versión anterior) */}
      <Footer brand="737LAB" fixed />
    </main>
  );
}
