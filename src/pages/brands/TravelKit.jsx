// src/pages/brands/TravelKit.jsx
import React, { useMemo, useState, useEffect } from "react";
import { BRANDS } from "../../brandsData";
import { Link } from "react-router-dom";

const data = BRANDS.find((b) => b.slug === "travel-kit");

export default function BrandTravelKit() {
  if (!data) return null;

  // ⬇️ Fija un fondo global más vivo para ESTA página (vía --page-bg)
  useEffect(() => {
    const shell = document.getElementById("top");
    if (!shell) return;

    // Gradientes superpuestos: wash diagonal + halos + base
    const vividBg = [
      "linear-gradient(120deg, rgba(126,187,255,.14), rgba(167,139,250,.12) 40%, transparent 70%)",
      "radial-gradient(1100px 700px at 85% 8%, rgba(126,187,255,.30), transparent 60%)",
      "radial-gradient(900px 600px at 10% 85%, rgba(167,139,250,.28), transparent 60%)",
      "#0a0b0e",
    ].join(",");

    const prev = shell.style.getPropertyValue("--page-bg");
    shell.style.setProperty("--page-bg", vividBg);

    return () => {
      if (prev) shell.style.setProperty("--page-bg", prev);
      else shell.style.removeProperty("--page-bg");
    };
  }, []);

  // Portada + galería (garantizamos 3 imágenes)
  const pics = useMemo(() => {
    const arr = [data.image, ...(data.gallery || [])].filter(Boolean);
    while (arr.length < 3) arr.push(arr[arr.length - 1] || data.image);
    return arr.slice(0, 3);
  }, []);

  return (
    <section
      className="relative mx-auto max-w-6xl px-4 pb-28 pt-12"
      style={{
        ["--accent-rgb"]: "126, 187, 255",
        ["--bio-blue-rgb"]: "126, 187, 255",
        ["--bio-violet-rgb"]: "167, 139, 250",
      }}
    >
      {/* ---------- Fondo biotech elegante (capas adicionales) ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* halo cian reforzado */}
        <div
          className="absolute -top-36 right-[-16%] h-[68vmin] w-[68vmin] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(50% 45% at 40% 35%, rgba(var(--bio-blue-rgb),.42), transparent 65%)",
            mixBlendMode: "screen",
            opacity: 1,
          }}
        />
        {/* halo violeta reforzado */}
        <div
          className="absolute -bottom-28 left-[-14%] h-[62vmin] w-[62vmin] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(52% 48% at 60% 60%, rgba(var(--bio-violet-rgb),.36), transparent 65%)",
            mixBlendMode: "screen",
            opacity: 0.95,
          }}
        />
        {/* micro-puntos (sensación nano/biotech) */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(85% 65% at 55% 45%, black 60%, transparent 100%)",
          }}
        />
        {/* líneas técnicas muy sutiles */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.1,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(126,187,255,.12), rgba(126,187,255,.12) 1px, transparent 1px, transparent 22px)," +
              "repeating-linear-gradient(90deg, rgba(167,139,250,.10), rgba(167,139,250,.10) 1px, transparent 1px, transparent 22px)",
            maskImage:
              "radial-gradient(90% 70% at 50% 40%, black 50%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
        {/* viñeta para mantener foco */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_65%_at_50%_30%,transparent,rgba(0,0,0,.32))]" />
      </div>
      {/* ---------- /Fondo ---------- */}

      {/* HERO */}
      <header className="mb-12 grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Presentación de marca
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.05] md:text-6xl">
            {data.name}
          </h1>

          <p className="mt-5 max-w-[52ch] text-neutral-300">
            {data.long || data.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-neutral-300">
            {data.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-sm text-white transition hover:border-[rgba(var(--accent-rgb),.5)] hover:bg-[rgba(var(--accent-rgb),.12)]"
            >
              Visitar sitio ↗
            </a>
            <Link
              to="/"
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-neutral-200 transition hover:border-[rgba(var(--accent-rgb),.35)] hover:bg-[rgba(var(--accent-rgb),.08)]"
            >
              Volver a marcas
            </Link>
          </div>
        </div>

        <AccentImage src={pics[0]} alt={`${data.name} hero`} height="h-[380px]" />
      </header>

      {/* MOSAICO */}
      <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Tile src={pics[1]} className="md:col-span-3" />
        <Tile src={pics[2]} className="md:col-span-3" />
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          title="Pensado para moverse"
          bullets={[
            "Miniaturas TSA y envases recargables",
            "Organización compacta y acceso rápido",
            "Diseñado para trayectos largos",
          ]}
        />
        <FeatureCard
          title="Esenciales que suman"
          bullets={[
            "Rutinas de skincare portátiles",
            "Texturas y fragancias suaves",
            "Kits modulares según destino",
          ]}
        />
        <FeatureCard
          title="Hecho para durar"
          bullets={[
            "Materiales resistentes al uso y fugas",
            "Cierres y costuras reforzadas",
            "Garantía y piezas de reemplazo",
          ]}
        />
      </div>
    </section>
  );
}

/* -------- helpers -------- */

// 🔁 Reemplaza estas dos funciones en src/pages/brands/TravelKit.jsx

function Tile({ src, className = "" }) {
  const [broken, setBroken] = useState(false);
  return (
    // ⬇️ sin borde, sin fondo y sin blur
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      {broken ? (
        <Placeholder />
      ) : (
        <img
          src={src}
          alt="Travel Kit"
          loading="lazy"
          decoding="async"
          className="block h-[280px] w-full rounded-2xl object-cover md:h-[320px]"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

function AccentImage({ src, alt, height = "h-[380px]" }) {
  const [broken, setBroken] = useState(false);

  return (
    <figure className="relative">
      {broken ? (
        <Placeholder big />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setBroken(true)}
          loading="eager"
          decoding="async"
          className={`block w-full ${height} rounded-2xl object-cover`}
          style={{ border: 0, outline: "none", boxShadow: "none", background: "transparent" }}
        />
      )}
    </figure>
  );
}



function Placeholder({ big = false }) {
  return (
    <div
      className={`w-full ${big ? "h-[380px]" : "h-[320px]"} rounded-2xl`}
      style={{
        background:
          "radial-gradient(60% 60% at 35% 35%, rgba(var(--bio-blue-rgb), .22), rgba(var(--bio-violet-rgb), .14) 60%, transparent 95%)",
      }}
    />
  );
}

function FeatureCard({ title, bullets = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-[2px]">
      <h3 className="mb-3 text-base font-semibold text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-neutral-300">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span
              aria-hidden
              className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full"
              style={{ backgroundColor: "rgba(var(--accent-rgb), .95)" }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
