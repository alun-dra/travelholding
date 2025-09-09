import React, { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRANDS } from "./brandsData";
import { Link } from "react-router-dom"; // si usarás rutas

// Register GSAP plugin
if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Landing para Holding (seria y llamativa)
 * - Hero con animación de texto y blob parallax
 * - Indicador circular de progreso de scroll
 * - Sección de Marcas (3 items) con reveal, tilt y botón CTA
 * - Marquee horizontal con nombres de marcas (auto loop)
 * - Microinteracciones "magnéticas" en botones
 */



// SVG noise como data-URI de forma segura en JSX (evita errores de comillas en clases Tailwind)
const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.6"/></svg>'
)}")`;

export default function HoldingLandingGSAP() {
  const rootRef = useRef(null);
  const circleRef = useRef(null);
  const marqueeRef = useRef(null);
  const heroBlobRef = useRef(null);

  const circ = useMemo(() => 2 * Math.PI * 36, []); // r=36 para el progreso

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Progress circle synced with scroll
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

      // HERO: split-like animation (cada span) + blob parallax
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-kicker", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(".hero-title span", { yPercent: 120, duration: 0.8, stagger: 0.08 }, "<")
        .from(".hero-sub", { y: 14, autoAlpha: 0, duration: 0.6 }, "-=0.2");

      gsap.to(heroBlobRef.current, {
        yPercent: 15,
        scale: 1.04,
        rotate: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // MARCAS: reveal + tilt + spotlight que sigue el mouse
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

        // Hover tilt + spotlight siguiendo el puntero
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * 6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * -6;
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.3, ease: "power2.out" });
          // spotlight posición
          const mx = ((e.clientX - r.left) / r.width) * 100;
          const my = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--mx", `${mx}%`);
          card.style.setProperty("--my", `${my}%`);
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });
        });
      });

      // Botones magnéticos (CTA)
      document.querySelectorAll(".magnet").forEach((wrap) => {
        const inner = wrap.querySelector("span");
        const strength = 20;
        wrap.addEventListener("mousemove", (e) => {
          const r = wrap.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
          const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
          gsap.to(inner, { x, y, duration: 0.25, ease: "power3.out" });
        });
        wrap.addEventListener("mouseleave", () => {
          gsap.to(inner, { x: 0, y: 0, duration: 0.35, ease: "power3.out" });
        });
      });

      // Marquee auto loop
      if (marqueeRef.current) {
        const row = marqueeRef.current.querySelector(".marquee-row");
        gsap.set(row, { xPercent: 0 });
        gsap.to(row, {
          xPercent: -50,
          duration: 20,
          repeat: -1,
          ease: "linear",
        });
      }

      // Línea subrayado del título Brands animada mientras scrollea
      gsap.to(".brands-underline", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: ".brands-section",
          start: "top 85%",
          end: "top 40%",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [circ]);

  return (
    <main
      ref={rootRef}
      className="min-h-svh bg-neutral-950 text-neutral-100 antialiased selection:bg-white/20"
    >
      {/* Noise / texture sutil */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: NOISE_BG, opacity: 0.06 }}
      />

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

      {/* PROGRESS CIRCLE */}
      <div className="pointer-events-none fixed right-5 top-5 z-50 h-16 w-16 opacity-90 [filter:drop-shadow(0_2px_8px_rgba(0,0,0,.35))]">
        <svg viewBox="0 0 84 84" className="h-16 w-16 rotate-[-90deg]">
          <circle cx="42" cy="42" r="36" stroke="#2A2A2A" strokeWidth="6" fill="none" />
          <circle ref={circleRef} cx="42" cy="42" r="36" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* HERO */}
      <section id="top" className="hero relative flex min-h-svh items-center overflow-hidden">
        {/* Blob gradiente */}
        <div
          ref={heroBlobRef}
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-[60vmin] w-[60vmin] rounded-full bg-gradient-to-tr from-white/10 via-white/5 to-transparent blur-3xl"
        />

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-28">
          <p className="hero-kicker text-sm uppercase tracking-[0.2em] text-neutral-400">✨ Tres marcas, un solo ritual de vida</p>
          <h1 className="hero-title text-5xl font-semibold leading-[1.05] md:text-7xl">
            <span className="inline-block overflow-hidden align-top">Invertimos</span>
            <br />
            <span className="inline-block overflow-hidden align-top">y escalamos</span>{" "}
            <span className="inline-block overflow-hidden align-top">marcas</span>
          </h1>
          <p className="hero-sub max-w-xl text-balance text-lg text-neutral-300 md:text-xl">
            Tres compañías, una visión. Innovación, seguridad y producto para crecer con foco en el largo plazo.
          </p>

          <div className="mt-2 flex gap-3">
            <a
              href="#brands"
              className="magnet inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <span>Ver marcas →</span>
            </a>
            <a
              href="#about"
              className="magnet inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-sm text-neutral-200 transition hover:border-white/30 hover:bg-white/5"
            >
              <span>Conócenos</span>
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        {/* <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center opacity-100">
          <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-neutral-200 backdrop-blur">
            737LAB • scroll / swipe para explorar
          </div>
        </div> */}
      </section>

      {/* MARQUEE */}
      <section ref={marqueeRef} aria-hidden className="relative z-10 mx-auto mt-[-32px] max-w-6xl overflow-hidden px-4 pb-2">
        <div className="marquee-row flex min-w-[200%] select-none gap-10 whitespace-nowrap opacity-60">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div key={i} className="text-sm uppercase tracking-[0.25em] text-neutral-400">
              {b.name} •
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section id="brands" className="brands-section relative z-0 mx-auto max-w-6xl px-4 pb-28 pt-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold md:text-4xl">Nuestras marcas</h2>
          <div className="brands-underline mt-2 h-[2px] w-24 origin-left scale-x-0 bg-white/30" />
          <p className="mt-3 max-w-3xl text-sm text-neutral-300">
            En un mundo que se mueve rápido, cada espacio merece su propio ritual. Te presentamos tres marcas que transforman lo cotidiano en experiencia, lo funcional en belleza, y lo transitorio en memoria.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
  {BRANDS.map((b) => (
    <article
      key={b.slug}
      className="brand-card group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl transition will-change-transform"
    >
      {/* halo sutil por marca */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100"
        style={{
          background: `radial-gradient(520px 220px at var(--mx,50%) var(--my,50%), ${b.spotlight}, transparent)`,
        }}
      />

      {/* imagen */}
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl">
        <img
          src={b.image}
          alt={b.name}
          className="brand-image h-full w-full scale-[1.06] object-cover object-center transition duration-700 will-change-transform group-hover:scale-100"
          loading="lazy"
        />
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent`} />
      </div>

      {/* título + logo */}
      <div className="mt-5 flex items-center gap-3">
        {b.logo && <img src={b.logo} alt={`${b.name} logo`} className="h-6 w-auto opacity-90" />}
        <h3 className="text-xl font-semibold leading-tight md:text-2xl">{b.name}</h3>
      </div>

      <p className="mt-2 text-sm text-neutral-300">{b.summary}</p>

      {/* tags */}
      <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-neutral-300">
        {b.tags.map((t) => (
          <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
            {t}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-5 flex items-center justify-between gap-2">
        {/* Presentación interna */}
        <Link
          to={`/brand/${b.slug}`}
          className="magnet inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs text-white transition hover:border-white/30 hover:bg-white/10"
          aria-label={`Ver presentación de ${b.name}`}
        >
          <span>Presentación</span>
        </Link>
        {/* Sitio externo */}
        <a
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          className="magnet inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-100 transition hover:border-white/30 hover:bg-white/5"
          aria-label={`Visitar sitio de ${b.name}`}
        >
          <span>Visitar sitio</span>
          <span aria-hidden>↗</span>
        </a>
      </div>

      {/* borde activo sobrio */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 transition group-hover:ring-white/20" />
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
              Gestionamos y potenciamos compañías complementarias. Gobierno corporativo, tecnología compartida y una cultura de ejecución rigurosa.
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-6 text-neutral-300">
              <li>Gobernanza y despliegue de capital eficientes.</li>
              <li>Prácticas de seguridad y cumplimiento unificadas.</li>
              <li>Capas de diseño y experiencia consistentes entre marcas.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-sm text-neutral-300">
            <h3 className="mb-3 text-base font-semibold text-white">Contacto</h3>
            <p className="mb-3">¿Interesado en colaborar o invertir?</p>
            <a href="#" className="magnet inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm hover:border-white/30 hover:bg-white/5"><span>Escríbenos</span></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-neutral-400">
        <p>© {new Date().getFullYear()} 737LAB • Hecho con GSAP + React + Tailwind</p>
      </footer>
    </main>
  );
}
