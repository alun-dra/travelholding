// src/pages/brands/TravelKit.jsx
import React, { useMemo, useState, useEffect } from "react";
import { BRANDS } from "../../brandsData";
import { Link } from "react-router-dom";

const data = BRANDS.find((b) => b.slug === "travel-kit");

// ---- helper: pre-carga una imagen y dice si está OK
function probeImage(src, timeout = 8000) {
  return new Promise((resolve) => {
    if (!src) return resolve(false);
    const img = new Image();
    let done = false;
    const end = (ok) => {
      if (done) return;
      done = true;
      resolve(ok);
    };
    img.onload = () => end(true);
    img.onerror = () => {
      console.warn("[TravelKit] Imagen falló:", src);
      end(false);
    };
    const t = setTimeout(() => {
      console.warn("[TravelKit] Timeout imagen:", src);
      end(false);
    }, timeout);
    img.onloadend = () => clearTimeout(t);
    img.src = src;
    // Para algunos hosts que bloquean referer
    img.referrerPolicy = "no-referrer";
    img.crossOrigin = "anonymous";
  });
}

export default function BrandTravelKit() {
  if (!data) return null;

  // Fondo de página
  useEffect(() => {
    const shell = document.getElementById("top");
    if (!shell) return;
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

  // ---- Armamos pics SOLO con las que realmente cargan
  const [pics, setPics] = useState([]);

  useEffect(() => {
    let alive = true;
    const raw = [data?.image, ...(data?.gallery || [])].filter(Boolean);

    (async () => {
      const ok = [];
      for (const src of raw) {
        // Evita mixed content: si la página está en https y la imagen en http, fuerza https si aplica
        const fixed =
          typeof src === "string" &&
          src.startsWith("http://") &&
          window.location.protocol === "https:"
            ? src.replace(/^http:\/\//, "https://")
            : src;

        // Si es ruta relativa y usas Vite + public/, asegúrate del slash inicial
        const normalized =
          typeof fixed === "string" && !/^https?:|^data:|^\//.test(fixed)
            ? `/${fixed}`
            : fixed;

        if (await probeImage(normalized)) ok.push(normalized);
        if (ok.length >= 3) break;
      }
      // Si no llegamos a 3, duplica la última válida para llenar huecos
      while (ok.length && ok.length < 3) ok.push(ok[ok.length - 1]);
      if (alive) setPics(ok);
    })();

    return () => {
      alive = false;
    };
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
      {/* Halos de fondo */}
      <div className="pointer-events-none absolute -inset-px -z-10">
        <div
          className="absolute -top-36 right-[-16%] h-[68vmin] w-[68vmin] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(50% 45% at 40% 35%, rgba(var(--bio-blue-rgb),.42), transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute -bottom-28 left-[-14%] h-[62vmin] w-[62vmin] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(52% 48% at 60% 60%, rgba(var(--bio-violet-rgb),.36), transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

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

function Tile({ src, className = "" }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return <Placeholder />;
  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <img
        src={src}
        alt="Travel Kit"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="block h-[280px] w-full rounded-2xl object-cover md:h-[320px]"
        onError={() => setBroken(true)}
      />
    </div>
  );
}

function AccentImage({ src, alt, height = "h-[380px]" }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return <Placeholder big />;

  return (
    <figure className="relative">
      <img
        src={src}
        alt={alt}
        onError={() => setBroken(true)}
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={`block w-full ${height} rounded-2xl object-cover`}
        style={{ border: 0, outline: "none", boxShadow: "none", background: "transparent" }}
      />
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

/** FeatureCard (se queda igual con el spotlight) */
function FeatureCard({ title, bullets = [] }) {
  const [style, setStyle] = useState({});
  function handleMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setStyle({ "--mx": `${x}px`, "--my": `${y}px` });
  }
  return (
    <div
      onMouseMove={handleMove}
      style={style}
      className="
        group relative rounded-2xl border border-white/10
        bg-white/[0.04] p-5 backdrop-blur-[3px]
        transition-transform duration-300 will-change-transform
        hover:-translate-y-1
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_12px_30px_-12px_rgba(0,0,0,0.45),0_18px_50px_-20px_rgba(var(--accent-rgb),0.35)]
        "
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px 220px at var(--mx) var(--my), rgba(var(--accent-rgb),.20), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.06), inset 0 -1px 0 0 rgba(0,0,0,0.25)",
        }}
      />

      <h3 className="relative z-10 mb-3 text-base font-semibold text-white">
        {title}
      </h3>
      <ul className="relative z-10 space-y-2 text-sm text-neutral-300">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span
              aria-hidden
              className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(var(--accent-rgb),1), rgba(var(--accent-rgb),.55))",
                boxShadow: "0 0 10px rgba(var(--accent-rgb),.45)",
              }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
