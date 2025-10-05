import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef(null);
  const heroBlobRef = useRef(null);
  const lavaRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const cleanupFns = [];

    const ctx = gsap.context(() => {
      // Entrada de textos
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-kicker", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(".hero-title span", { yPercent: 120, duration: 0.8, stagger: 0.08 }, "<")
        .from(".hero-sub", { y: 14, autoAlpha: 0, duration: 0.6 }, "-=0.2");

      // Parallax del halo
      gsap.to(heroBlobRef.current, {
        yPercent: 15,
        scale: 1.04,
        rotate: 10,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Lava lamp (metaballs)
      if (!prefersReduce && lavaRef.current) {
        const wrap = lavaRef.current;
        const rand = gsap.utils.random;

        const roam = (el) => {
          const r = wrap.getBoundingClientRect();
          const w = el.offsetWidth, h = el.offsetHeight, pad = 20;
          const xMin = -pad, xMax = r.width - w + pad;
          const yMin = -pad, yMax = r.height - h + pad;

          gsap.set(el, {
            x: rand(xMin, xMax),
            y: rand(yMin, yMax),
            scale: rand(0.7, 1.3),
            opacity: rand(0.45, 0.8),
            transformOrigin: "50% 50%",
          });

          const drift = () => {
            gsap.to(el, {
              duration: rand(8, 16),
              x: rand(xMin, xMax),
              y: rand(yMin, yMax),
              ease: "sine.inOut",
              onComplete: drift,
            });
          };
          drift();

          gsap.to(el, { duration: rand(6, 10),  scale: () => rand(0.7, 1.4), ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.to(el, { duration: rand(12, 20), rotate: () => rand(-25, 25), ease: "sine.inOut", yoyo: true, repeat: -1 });
        };

        const blobs = wrap.querySelectorAll(".lava-blob");
        blobs.forEach(roam);

        const onResize = () => {
          blobs.forEach((el) => {
            gsap.killTweensOf(el);
            roam(el);
          });
        };
        window.addEventListener("resize", onResize);
        cleanupFns.push(() => window.removeEventListener("resize", onResize));
      }
    }, heroRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero relative flex min-h-svh items-center overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* LAVA LAMP */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg className="absolute inset-0 h-0 w-0" aria-hidden>
          <defs>
            <filter id="goo737" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
              <feColorMatrix
                in="blur" mode="matrix"
                values={`
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 20 -10
                `}
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        <div
          ref={lavaRef}
          className="absolute inset-0"
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

      {/* halo suave */}
      <div
        ref={heroBlobRef}
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[60vmin] w-[60vmin] rounded-full blur-3xl"
        style={{ background: "radial-gradient(60% 60% at 50% 10%, rgba(var(--accent-rgb), .22), rgba(0,0,0,0))" }}
      />

      {/* contenido */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-28">
        <p className="hero-kicker text-sm uppercase tracking-[0.2em] text-neutral-400">
          Tres marcas, un solo ritual de vida
        </p>
        <h1 className="hero-title text-5xl font-semibold leading-[1.08] md:text-7xl">
          <span className="reveal-line inline-block overflow-hidden pb-[0.20em] align-baseline">
            <span className="reveal-content inline-block">Soluciones integradas</span>
          </span>
          <br />
          <span className="reveal-line inline-block overflow-hidden pb-[0.12em] align-baseline">
            <span className="reveal-content inline-block">para un mundo en</span>
          </span>{" "}
          <span className="reveal-line inline-block overflow-hidden pb*[0.12em] align-baseline">
            <span className="reveal-content inline-block">evolución</span>
          </span>
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
  );
}
