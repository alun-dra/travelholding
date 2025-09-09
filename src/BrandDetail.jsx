import React, { useLayoutEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { BRANDS } from "./brandsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
  gsap.registerPlugin(ScrollTrigger);
}

const FALLBACK_IMG = "/placeholder.jpg"; // coloca un jpg sobrio en /public

export default function BrandDetail() {
  const { slug } = useParams();
  const brand = BRANDS.find((b) => b.slug === slug) || BRANDS[0];

  const rootRef = useRef(null);
  const heroImgRef = useRef(null);

  const FALLBACK_URL =
    typeof window !== "undefined"
      ? new URL(FALLBACK_IMG, window.location.origin).toString()
      : FALLBACK_IMG;

  const onImgError = (e) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_URL) {
      img.onerror = null; // evita loop
      img.src = FALLBACK_URL;
    } else {
      // si ni el fallback carga, ocultamos el bloque
      img.closest(".bd-photo")?.classList.add("hidden");
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero: kicker, título, subtítulo, chips
      gsap.from([".bd-kicker", ".bd-title", ".bd-sub", ".bd-chip"], {
        y: 14,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
      });

      // Parallax sutil en imagen del hero
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: ".bd-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Reveal tarjetas
      gsap.from(".bd-card", {
        y: 18,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".bd-sections", start: "top 85%" },
      });

      // Reveal fotos galería
      gsap.from(".bd-photo", {
        y: 16,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".bd-gallery", start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="min-h-svh bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <section className="bd-hero relative overflow-hidden">
        {/* Acento sutil por marca */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(1400px 480px at 50% -10%, ${brand.spotlight}, transparent)`,
          }}
        />
        <div
          className="mx-auto grid max-w-6xl lg:max-w-7xl
                     grid-cols-1 md:grid-cols-12 items-end
                     gap-10 lg:gap-12
                     px-6 sm:px-8 lg:px-10
                     pt-28 pb-20 md:pb-24"
        >
          {/* Texto */}
          <div className="md:col-span-7">
            <p className="bd-kicker text-[11px] uppercase tracking-[0.25em] text-neutral-400">
              Presentación de marca
            </p>
            <h1 className="bd-title mt-2 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {brand.name}
            </h1>
            <p className="bd-sub mt-3 max-w-2xl text-neutral-200">
              {brand.long || brand.summary}
            </p>

            {/* Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {brand.tags?.map((t) => (
                <span
                  key={t}
                  className="bd-chip rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-neutral-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm hover:border-white/30 hover:bg-white/10"
              >
                Visitar sitio ↗
              </a>
              <Link
                to="/#brands"
                className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-200 hover:border-white/30 hover:bg-white/5"
              >
                Volver a marcas
              </Link>
            </div>
          </div>

          {/* Imagen encuadrada */}
          <div className="md:col-span-5 mt-6 md:mt-0">
            <figure className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.02]">
              <img
                ref={heroImgRef}
                src={brand.image}
                alt=""
                decoding="async"
                loading="lazy"
                onError={onImgError}
                className="h-72 w-full object-cover md:h-[22rem]"
              />
            </figure>
          </div>
        </div>

        {/* Separador sutil bajo hero */}
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="h-px w-full bg-white/10" />
        </div>
      </section>

      {/* SECCIONES */}
      <section
        className="bd-sections mx-auto max-w-6xl lg:max-w-7xl
                   px-6 sm:px-8 lg:px-10
                   pt-12 pb-[calc(env(safe-area-inset-bottom,0px)+8rem)]"
      >
        {/* Tarjetas */}
        <div className="grid grid-cols-1 gap-8 lg:gap-10 md:grid-cols-3">
          <div className="bd-card min-h-[188px] rounded-[22px] border border-white/10 bg-white/[0.02] p-6 lg:p-7">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Propósito</p>
            <p className="mt-2 text-neutral-200">{brand.summary}</p>
          </div>

          <div className="bd-card min-h-[188px] rounded-[22px] border border-white/10 bg-white/[0.02] p-6 lg:p-7">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Pilares</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
              <li>Producto con significado</li>
              <li>Diseño atemporal</li>
              <li>Experiencia consistente</li>
            </ul>
          </div>

          <div className="bd-card min-h-[188px] rounded-[22px] border border-white/10 bg-white/[0.02] p-6 lg:p-7">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Etiquetas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {brand.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-neutral-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Galería */}
        <div className="bd-gallery mt-10 grid grid-cols-1 gap-8 lg:gap-10 md:grid-cols-3">
          {brand.gallery?.map((src, i) => (
            <div
              key={i}
              className="bd-photo overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.02]"
            >
              <img
                src={src}
                alt=""
                decoding="async"
                loading="lazy"
                onError={onImgError}
                className="h-64 w-full object-cover md:h-72"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer minimal para cierre visual */}
      <footer className="mx-auto max-w-6xl lg:max-w-7xl px-6 sm:px-8 lg:px-10 pb-10">
        <p className="text-xs text-neutral-400">© {new Date().getFullYear()} 737LAB</p>
      </footer>
    </main>
  );
}
