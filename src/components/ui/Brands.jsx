import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { BRANDS as DEFAULT_BRANDS } from "../../brandsData";

if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Brands({ brands = DEFAULT_BRANDS }) {
  const rootRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const cleanupFns = [];

    const ctx = gsap.context(() => {
      // Fondo animado (burbujas)
      if (bgRef.current) {
        const wrap = bgRef.current;
        const blobs = wrap.querySelectorAll(".brand-blob");
        const rand = gsap.utils.random;

        const roam = (el) => {
          const r = wrap.getBoundingClientRect();
          const w = el.offsetWidth, h = el.offsetHeight, pad = 30;
          const xMin = -pad, xMax = r.width - w + pad;
          const yMin = -pad, yMax = r.height - h + pad;

          gsap.set(el, {
            x: rand(xMin, xMax),
            y: rand(yMin, yMax),
            scale: rand(0.8, 1.3),
            opacity: rand(0.65, 0.95),
          });

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

          gsap.to(el, { duration: rand(8, 14), scale: () => rand(0.85, 1.35), ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.to(el, { duration: rand(9, 15), opacity: () => rand(0.75, 1), ease: "sine.inOut", yoyo: true, repeat: -1 });
        };

        blobs.forEach(roam);
        const onResize = () => blobs.forEach(roam);
        window.addEventListener("resize", onResize);
        cleanupFns.push(() => window.removeEventListener("resize", onResize));
      }

      // Reveal correcto (solo una vez, no desaparecen)
      const cards = rootRef.current.querySelectorAll(".brand-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.08,
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      // Tilt + spotlight + sheen
      cards.forEach((card) => {
        const img = card.querySelector(".brand-image");
        const bg = card.querySelector(".brand-bg");
        const sheen = card.querySelector(".sheen");

        gsap.set(card, { rotateX: 0, rotateY: 0, y: 0, zIndex: 1 });
        gsap.set(img,  { scale: 1.06, yPercent: -6 });
        gsap.set(bg,   { opacity: 0 });

        const onEnter = () => {
          gsap.to(card, { y: -6, duration: 0.4, ease: "power3.out" });
          gsap.fromTo(sheen, { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: 0.9, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.45, ease: "power2.out" });
        };
        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * 6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * -6;
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.25, ease: "power2.out" });

          const mx = ((e.clientX - r.left) / r.width) * 100;
          const my = ((e.clientY - r.top)  / r.height) * 100;
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

      // Chips
      gsap.from(rootRef.current.querySelectorAll(".chip"), {
        y: 8,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
      });

      // Subrayado título
      gsap.to(rootRef.current.querySelector(".brands-underline"), {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", end: "top 40%", scrub: true },
      });
    }, rootRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="brands"
      ref={rootRef}
      className="brands-section relative z-0 mx-auto max-w-6xl px-4 pb-28 pt-16"
      style={{ isolation: "isolate" }}
    >
      {/* Fondo animado */}
      <div className="pointer-events-none absolute inset-[-8%] -z-10">
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            filter: "contrast(1.1) brightness(1.15) saturate(1.05)",
            mixBlendMode: "screen",
            opacity: 0.55,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="brand-blob absolute left-0 top-0 aspect-square w-[26vmin] rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(60% 60% at 35% 35%, rgba(var(--accent-rgb),.5), rgba(var(--accent-rgb),.2) 60%, transparent 80%)",
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,transparent,rgba(0,0,0,.12))]" />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold md:text-4xl">Nuestras marcas</h2>
        <div className="brands-underline mt-2 h-[2px] w-24 origin-left scale-x-0 bg-[rgba(var(--accent-rgb),.4)]" />
        <p className="mt-3 max-w-3xl text-sm text-neutral-300">
          En un mundo que se mueve rápido, cada espacio merece su propio ritual. Te presentamos tres marcas que
          transforman lo cotidiano en experiencia, lo funcional en belleza, y lo transitorio en memoria.
        </p>
      </div>

      {/* ⬇︎ Igualamos alturas de tarjetas */}
      <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 items-stretch auto-rows-fr">
        {brands.map((b) => (
          <article
            key={b.slug}
            className="brand-card group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-2xl transition will-change-transform h-full flex flex-col"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* halo/acento reactivo al mouse */}
            <div
              className="brand-bg pointer-events-none absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100"
              style={{
                background: `radial-gradient(520px 220px at var(--mx,50%) var(--my,50%), ${
                  b.spotlight || "rgba(var(--accent-rgb),.22)"
                }, transparent)`,
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

            {/* CONTENIDO (ocupa el alto disponible) */}
            <div className="flex-1 mt-5">
              <div className="flex items-center gap-3">
                {b.logo && <img src={b.logo} alt={`${b.name} logo`} className="h-6 w-auto opacity-90" />}
                <h3 className="text-xl font-semibold leading-tight md:text-2xl">{b.name}</h3>
              </div>

              <p className="mt-2 text-sm text-neutral-300">{b.summary}</p>

              <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-neutral-300">
                {b.tags.map((t) => (
                  <span key={t} className="chip rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAS (pegadas abajo) */}
            <div className="mt-auto pt-5 flex items-center justify-between gap-2">
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

            {/* Sheen */}
            <div className="sheen pointer-events-none absolute inset-0 -z-0 translate-x-[-120%] opacity-0 bg-[linear-gradient(100deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.22)_50%,rgba(255,255,255,0)_100%)] mix-blend-screen" />
            <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 transition group-hover:ring-[rgba(var(--accent-rgb),.35)]" />
          </article>
        ))}
      </div>
    </section>
  );
}
