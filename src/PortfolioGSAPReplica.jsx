import React, { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRANDS } from "./brandsData";
import { Link } from "react-router-dom";

if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
  gsap.registerPlugin(ScrollTrigger);
}

/** Acento de la pluma (arena/sepia) */
const FEATHER_ACCENT = {
  hex: "#B79C7B",
  rgb: "183,156,123",
  spot: "rgba(183,156,123,.18)",
  spotStrong: "rgba(183,156,123,.28)",
};

// Noise sutil
const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.6"/></svg>'
)}")`;

export default function HoldingLandingGSAP() {
  const rootRef = useRef(null);
  const circleRef = useRef(null);
  const marqueeRef = useRef(null);
  const heroBlobRef = useRef(null);
  const lavaRef = useRef(null); // lava lamp wrapper
  const brandsBgRef = useRef(null);

  const circ = useMemo(() => 2 * Math.PI * 36, []);

  useLayoutEffect(() => {
    // 📦 aquí recolectamos todas las limpiezas (removeEventListener, etc.)
    const cleanupFns = [];

    const ctx = gsap.context(() => {
      // Progress
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!circleRef.current) return;
          const offset = circ - circ * self.progress;
          circleRef.current.style.strokeDasharray = `${circ}`;
          circleRef.current.style.strokeDashoffset = `${offset}`;
        },
      });

      // Hero in
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-kicker", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(".hero-title span", { yPercent: 120, duration: 0.8, stagger: 0.08 }, "<")
        .from(".hero-sub", { y: 14, autoAlpha: 0, duration: 0.6 }, "-=0.2");

      gsap.to(heroBlobRef.current, {
        yPercent: 15,
        scale: 1.04,
        rotate: 10,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // ── LAVA LAMP (metaballs gooey) ──────────────────────────────────────────
      const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      if (!prefersReduce && lavaRef.current) {
        const wrap = lavaRef.current;
        const rand = gsap.utils.random;

        const roam = (el) => {
          const r = wrap.getBoundingClientRect();
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          const pad = 20; // deja respirar un poco fuera del borde

          const xMin = -pad;
          const xMax = r.width - w + pad;
          const yMin = -pad;
          const yMax = r.height - h + pad;

          // punto inicial aleatorio en TODO el hero
          gsap.set(el, {
            x: rand(xMin, xMax),
            y: rand(yMin, yMax),
            scale: rand(0.7, 1.3),
            opacity: rand(0.45, 0.8),
            transformOrigin: "50% 50%",
          });

          // caminata perpetua por todo el rango
          const drift = () => {
            gsap.to(el, {
              duration: rand(8, 16),
              x: rand(xMin, xMax),
              y: rand(yMin, yMax),
              ease: "sine.inOut",
              onComplete: drift, // vuelve a elegir destino
            });
          };
          drift();

          // pulso + ligera rotación
          gsap.to(el, {
            duration: rand(6, 10),
            scale: () => rand(0.7, 1.4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
          gsap.to(el, {
            duration: rand(12, 20),
            rotate: () => rand(-25, 25),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        };


        const blobs = wrap.querySelectorAll(".lava-blob");
        blobs.forEach((el) => roam(el));

        // reajusta trayectorias al redimensionar
        const onResize = () => {
          blobs.forEach((el) => {
            gsap.killTweensOf(el); // corta animaciones previas
            roam(el);              // recalcula límites y reanima
          });
        };
        window.addEventListener("resize", onResize);
        cleanupFns.push(() => window.removeEventListener("resize", onResize));
      }

      // ===== Fondo animado detrás de BRANDS =====
if (brandsBgRef.current) {
  const wrap = brandsBgRef.current;
  const blobs = wrap.querySelectorAll(".brand-blob");
  const rand = gsap.utils.random;

  const roam = (el) => {
    const r = wrap.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const pad = 30;
    const xMin = -pad,
      xMax = r.width - w + pad;
    const yMin = -pad,
      yMax = r.height - h + pad;

    // posición inicial
    gsap.set(el, {
      x: rand(xMin, xMax),
      y: rand(yMin, yMax),
      scale: rand(0.8, 1.3),
      opacity: rand(0.65, 0.95),
    });

    // deriva infinita
    const drift = () => {
      gsap.to(el, {
        duration: rand(12, 22),
        x: rand(xMin, xMax),
        y: rand(yMin, yMax),
        ease: "sine.inOut",
        onComplete: drift,
      });
    };
    drift();

    // pulso suave de tamaño
    gsap.to(el, {
      duration: rand(8, 14),
      scale: () => rand(0.85, 1.35),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // respiración de brillo
    gsap.to(el, {
      duration: rand(9, 15),
      opacity: () => rand(0.75, 1),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  };

  blobs.forEach(roam);

  const onResize = () => blobs.forEach(roam);
  window.addEventListener("resize", onResize);
  cleanupFns.push(() => window.removeEventListener("resize", onResize));
}

// ===== Tarjetas — reveal + tilt 3D + spotlight + sheen =====
gsap.from(".brand-card", {
  y: 28,
  autoAlpha: 0,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.08,
  scrollTrigger: { trigger: ".brands-section", start: "top 80%" },
});

gsap.utils.toArray(".brand-card").forEach((card) => {
  const img = card.querySelector(".brand-image");
  const bg = card.querySelector(".brand-bg");
  const sheen = card.querySelector(".sheen");

  // estado inicial
  gsap.set(card, { rotateX: 0, rotateY: 0, y: 0 });
  gsap.set(img, { scale: 1.06, yPercent: -6 });
  gsap.set(bg, { opacity: 0 });

  // hover: elevación sutil
  const onEnter = () => {
    gsap.to(card, { y: -6, duration: 0.4, ease: "power3.out" });
    // sheen barrido
    gsap.fromTo(
      sheen,
      { xPercent: -120, opacity: 0 },
      { xPercent: 120, opacity: 1, duration: 0.9, ease: "power2.out" }
    );
  };
  const onLeave = () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.45, ease: "power2.out" });
  };

  // tilt + spotlight que sigue al puntero
  const onMove = (e) => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * 6;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * -6;
    gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.25, ease: "power2.out" });

    // spotlight pos
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  };

  card.addEventListener("mouseenter", onEnter);
  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
  cleanupFns.push(() => {
    card.removeEventListener("mouseenter", onEnter);
    card.removeEventListener("mousemove", onMove);
    card.removeEventListener("mouseleave", onLeave);
  });
});

// Chips animadas al entrar
gsap.from(".chip", {
  y: 8,
  autoAlpha: 0,
  duration: 0.5,
  ease: "power2.out",
  stagger: 0.04,
  scrollTrigger: { trigger: ".brands-section", start: "top 70%" },
});


      // ─────────────────────────────────────────────────────────────────────────

      // Cards reveal + tilt + spotlight
      gsap.utils.toArray(".brand-card").forEach((card) => {
        const img = card.querySelector(".brand-image");
        const bg = card.querySelector(".brand-bg");
        gsap.set(card, { autoAlpha: 0, y: 36, rotateX: -2 });
        gsap.set(img, { scale: 1.06, yPercent: -6 });
        gsap.set(bg, { opacity: 0 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          onEnter: () => {
            gsap.to(card, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.9, ease: "power3.out" });
            gsap.to(img, { scale: 1, yPercent: 0, duration: 1.1, ease: "power3.out" });
            gsap.to(bg, { opacity: 1, duration: 1.0, ease: "power2.out" });
          },
        });

        // tilt + spotlight que sigue el puntero
        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * 6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * -6;
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.3, ease: "power2.out" });

          const mx = ((e.clientX - r.left) / r.width) * 100;
          const my = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--mx", `${mx}%`);
          card.style.setProperty("--my", `${my}%`);
        };
        const onLeave = () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanupFns.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // Botones magnéticos
      document.querySelectorAll(".magnet").forEach((wrap) => {
        const inner = wrap.querySelector("span");
        const strength = 20;

        const onMove = (e) => {
          const r = wrap.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
          const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
          gsap.to(inner, { x, y, duration: 0.25, ease: "power3.out" });
        };
        const onLeave = () => gsap.to(inner, { x: 0, y: 0, duration: 0.35, ease: "power3.out" });

        wrap.addEventListener("mousemove", onMove);
        wrap.addEventListener("mouseleave", onLeave);
        cleanupFns.push(() => {
          wrap.removeEventListener("mousemove", onMove);
          wrap.removeEventListener("mouseleave", onLeave);
        });
      });

      // Marquee
      if (marqueeRef.current) {
        const row = marqueeRef.current.querySelector(".marquee-row");
        gsap.set(row, { xPercent: 0 });
        gsap.to(row, { xPercent: -50, duration: 20, repeat: -1, ease: "linear" });
      }

      // Subrayado
      gsap.to(".brands-underline", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: ".brands-section", start: "top 85%", end: "top 40%", scrub: true },
      });
    }, rootRef);

    // 🧹 cleanup ordenado
    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, [circ]);

  return (
    <main
      ref={rootRef}
      className="min-h-svh bg-neutral-950 text-neutral-100 antialiased selection:bg-white/20"
      style={{ ["--accent"]: FEATHER_ACCENT.hex, ["--accent-rgb"]: FEATHER_ACCENT.rgb }}
    >
      {/* noise */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: NOISE_BG, opacity: 0.06 }} />

      {/* NAV */}
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="#top" className="font-semibold tracking-tight">737LAB</a>
          <nav className="flex items-center gap-6 text-sm text-neutral-300">
            <a href="#brands" className="hover:text-white transition">Marcas</a>
            <a href="#about" className="hover:text-white transition">Nosotros</a>
          </nav>
        </div>
      </header>

      {/* PROGRESS CIRCLE (color pluma) */}
      <div className="pointer-events-none fixed right-5 top-5 z-50 h-16 w-16 opacity-90 [filter:drop-shadow(0_2px_8px_rgba(0,0,0,.35))]">
        <svg viewBox="0 0 84 84" className="h-16 w-16 rotate-[-90deg]">
          <circle cx="42" cy="42" r="36" stroke="#2A2A2A" strokeWidth="6" fill="none" />
          <circle
            ref={circleRef}
            cx="42"
            cy="42"
            r="36"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            style={{ stroke: "rgba(var(--accent-rgb), 0.95)" }}
          />
        </svg>
      </div>

      {/* HERO */}
      <section
        id="top"
        className="hero relative flex min-h-svh items-center overflow-hidden"
        // 👇 asegura que el blend se aplique dentro del hero
        style={{ isolation: "isolate" }}
      >
        {/* lava lamp (detrás del texto) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* filtro gooey (debe ir antes del wrapper que lo usa) */}
          <svg className="absolute inset-0 h-0 w-0" aria-hidden>
            <defs>
              <filter id="goo737" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>

          {/* wrapper con filtro y blend */}
          <div
            ref={lavaRef}
            className="absolute inset-0"
            // style={{ filter: "url(#goo737)", mixBlendMode: "screen", opacity: 1 }}
            style={{
              
              filter: "url(#goo737) contrast(1.25) brightness(1.25) saturate(1.1)",
              mixBlendMode: "screen",
              opacity: 1, 
            }}
          >
            <span className="lava-blob absolute left-0 top-0 aspect-square w-[28vmin] rounded-full will-change-transform"
                  style={{ background: "radial-gradient(circle at 30% 30%, rgba(var(--accent-rgb),.75), rgba(var(--accent-rgb),.25) 60%, transparent 75%)" }} />
            <span className="lava-blob absolute left-0 top-0 aspect-square w-[22vmin] rounded-full will-change-transform"
                  style={{ background: "radial-gradient(circle at 40% 40%, rgba(var(--accent-rgb),.7), rgba(var(--accent-rgb),.22) 60%, transparent 75%)" }} />
            <span className="lava-blob absolute left-0 top-0 aspect-square w-[30vmin] rounded-full will-change-transform"
                  style={{ background: "radial-gradient(circle at 30% 30%, rgba(var(--accent-rgb),.7), rgba(var(--accent-rgb),.22) 60%, transparent 75%)" }} />
            <span className="lava-blob absolute left-0 top-0 aspect-square w-[18vmin] rounded-full will-change-transform"
                  style={{ background: "radial-gradient(circle at 35% 35%, rgba(var(--accent-rgb),.7), rgba(var(--accent-rgb),.22) 60%, transparent 75%)" }} />
            <span className="lava-blob absolute left-0 top-0 aspect-square w-[24vmin] rounded-full will-change-transform"
                  style={{ background: "radial-gradient(circle at 35% 35%, rgba(var(--accent-rgb),.7), rgba(var(--accent-rgb),.22) 60%, transparent 75%)" }} />
            <span className="lava-blob absolute left-0 top-0 aspect-square w-[20vmin] rounded-full will-change-transform"
                  style={{ background: "radial-gradient(circle at 40% 40%, rgba(var(--accent-rgb),.75), rgba(var(--accent-rgb),.25) 60%, transparent 75%)" }} />
          </div>




        </div>

          {/* halo suave existente (déjalo igual si quieres) */}
          <div
            ref={heroBlobRef}
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-10%] h-[60vmin] w-[60vmin] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 10%, rgba(var(--accent-rgb), .22), rgba(0,0,0,0))",
            }}
          />


        {/* halo suave existente */}
        <div
          ref={heroBlobRef}
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-[60vmin] w-[60vmin] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(60% 60% at 50% 10%, rgba(var(--accent-rgb), .22), rgba(0,0,0,0))",
          }}
        />

        {/* contenido */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-28">
          <p className="hero-kicker text-sm uppercase tracking-[0.2em] text-neutral-400">
            Tres marcas, un solo ritual de vida
          </p>
          <h1 className="hero-title text-5xl font-semibold leading-[1.05] md:text-7xl">
            <span className="inline-block overflow-hidden align-top">Soluciones integradas</span>
            <br />
            <span className="inline-block overflow-hidden align-top">para un mundo en </span>{" "}
            <span className="inline-block overflow-hidden align-top">evolución</span>
          </h1>
          <p className="hero-sub max-w-xl text-balance text-lg text-neutral-300 md:text-xl">
            Tres compañías, una visión. Innovación, seguridad y producto para crecer con foco en el largo plazo.
          </p>
          <div className="mt-2 flex gap-3">
            <a
              href="#brands"
              className="magnet inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-sm text-white transition hover:border-[rgba(var(--accent-rgb),.45)] hover:bg-[rgba(var(--accent-rgb),.08)]"
            >
              <span>Ver marcas →</span>
            </a>
            <a
              href="#about"
              className="magnet inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-sm text-neutral-200 transition hover:border-[rgba(var(--accent-rgb),.35)] hover:bg-[rgba(var(--accent-rgb),.06)]"
            >
              <span>Conócenos</span>
            </a>
          </div>
        </div>



      </section>

      {/* MARQUEE */}
      <section ref={marqueeRef} aria-hidden className="relative z-10 mx-auto mt-[-32px] max-w-6xl overflow-hidden px-4 pb-2">
        <div className="marquee-row flex min-w-[200%] select-none gap-10 whitespace-nowrap opacity-70">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div key={i} className="text-sm uppercase tracking-[0.25em] text-neutral-400">
              {b.name} •
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section id="brands" className="brands-section relative z-0 mx-auto max-w-6xl px-4 pb-28 pt-16">
        {/* Fondo animado (burbujas orbe) */}
        <div className="pointer-events-none absolute inset-[-8%] -z-10">
          <div
            ref={brandsBgRef}
            className="absolute inset-0"
            style={{
              filter: "contrast(1.15) brightness(1.15) saturate(1.05)",
              mixBlendMode: "screen",
              opacity: 0.75,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="brand-blob absolute left-0 top-0 aspect-square w-[26vmin] rounded-full will-change-transform"
                style={{
                  background:
                    "radial-gradient(60% 60% at 35% 35%, rgba(var(--accent-rgb),.55), rgba(var(--accent-rgb),.22) 60%, transparent 80%)",
                }}
              />
            ))}
          </div>

          {/* viñeta muy suave para centrar la mirada */}
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,transparent,rgba(0,0,0,.35))]" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold md:text-4xl">Nuestras marcas</h2>
          <div className="brands-underline mt-2 h-[2px] w-24 origin-left scale-x-0 bg-[rgba(var(--accent-rgb),.4)]" />
          <p className="mt-3 max-w-3xl text-sm text-neutral-300">
            En un mundo que se mueve rápido, cada espacio merece su propio ritual. Te
            presentamos tres marcas que transforman lo cotidiano en experiencia, lo
            funcional en belleza, y lo transitorio en memoria.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {BRANDS.map((b) => (
            <article
              key={b.slug}
              className="brand-card group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-2xl transition will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* halo/acento reactivo al mouse */}
              <div
                className="brand-bg pointer-events-none absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100"
                style={{
                  background: `radial-gradient(520px 220px at var(--mx,50%) var(--my,50%), ${b.spotlight || "rgba(var(--accent-rgb),.22)"}, transparent)`,
                }}
              />

              {/* IMAGEN */}
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl">
                <img
                  src={b.image}
                  alt={b.name}
                  className="brand-image h-full w-full scale-[1.06] object-cover object-center transition duration-700 will-change-transform group-hover:scale-100"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>

              {/* TÍTULO + LOGO */}
              <div className="mt-5 flex items-center gap-3">
                {b.logo && (
                  <img src={b.logo} alt={`${b.name} logo`} className="h-6 w-auto opacity-90" />
                )}
                <h3 className="text-xl font-semibold leading-tight md:text-2xl">{b.name}</h3>
              </div>

              <p className="mt-2 text-sm text-neutral-300">{b.summary}</p>

              {/* TAGS */}
              <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-neutral-300">
                {b.tags.map((t) => (
                  <span key={t} className="chip rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    {t}
                  </span>
                ))}
              </div>

              {/* CTAS */}
              <div className="mt-5 flex items-center justify-between gap-2">
                <Link
                  to={`/brand/${b.slug}`}
                  className="magnet inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs text-white transition hover:border-[rgba(var(--accent-rgb),.45)] hover:bg-[rgba(var(--accent-rgb),.08)]"
                >
                  <span>Presentación</span>
                </Link>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnet inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-100 transition hover:border-[rgba(var(--accent-rgb),.35)] hover:bg-[rgba(var(--accent-rgb),.06)]"
                >
                  <span>Visitar sitio</span>
                  <span aria-hidden>↗</span>
                </a>
              </div>

              {/* Destello (sheen) que barre en hover */}
              <div className="sheen pointer-events-none absolute inset-0 -z-0 translate-x-[-120%] opacity-0 bg-[linear-gradient(100deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.22)_50%,rgba(255,255,255,0)_100%)] mix-blend-screen" />

              {/* Borde activo */}
              <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 transition group-hover:ring-[rgba(var(--accent-rgb),.35)]" />
            </article>
          ))}
        </div>
      </section>


      {/* ABOUT */}
      <section id="about" className="relative mx-auto max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold md:text-4xl">Sobre el holding</h2>
            <p className="mt-4 max-w-prose text-neutral-300">
              Belleza consciente, movimiento inteligente, innovación sostenible.

              Somos un holding que conecta tres dimensiones esenciales del bienestar moderno: <br /> 
              <br />
              - Dermocosmética de alto estándar, creada para cuidar la piel con ciencia, sensibilidad y respeto por el entorno. <br />
              - Soluciones de viaje prácticas y elegantes, pensadas para acompañar cuerpos en movimiento con comodidad, estilo y ritual. <br />  
              - Innovación en gestión de residuos, transformando desafíos ambientales en oportunidades de impacto positivo. <br /><br />

              Cada línea responde a una misma visión: crear productos que cuiden, acompañen y transformen. Porque creemos que el bienestar personal, la movilidad consciente y el respeto por el planeta no son caminos separados, sino parte de una misma historia.
                          </p>
          
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-sm text-neutral-300">
            <h3 className="mb-3 text-base font-semibold text-white">Contacto</h3>
            <p className="mb-3">¿Interesado en colaborar o invertir?</p>
            <a
              href="#"
              className="magnet inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm hover:border-[rgba(var(--accent-rgb),.35)] hover:bg-[rgba(var(--accent-rgb),.06)]"
            >
              <span>Escríbenos</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-neutral-400">
        <p>© {new Date().getFullYear()} 737LAB</p>
      </footer>
    </main>
  );
}
