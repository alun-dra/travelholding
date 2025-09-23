import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Marquee (cinta infinita)
 * Props:
 * - items: string[] (p.ej. ["Marca A", "Marca B"])
 * - speed: segundos por ciclo (default 20)
 * - direction: "left" | "right" (default "left")
 * - className, gapClass: utilidades de estilo opcionales
 * - bullet: separador (default "•")
 * - uppercase: boolean (default true)
 */
export default function Marquee({
  items = [],
  speed = 20,
  direction = "left",
  className = "",
  gapClass = "gap-10",
  bullet = "•",
  uppercase = true,
}) {
  const marqueeRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const row = marqueeRef.current?.querySelector(".marquee-row");
      if (!row || prefersReduce) return;

      // posición inicial según dirección
      gsap.set(row, { xPercent: direction === "left" ? 0 : -50 });

      const tl = gsap.to(row, {
        xPercent: direction === "left" ? -50 : 0,
        duration: speed,
        ease: "linear",
        repeat: -1,
      });

      // pausa al pasar el mouse (opcional y sutil)
      const onEnter = () => tl.pause();
      const onLeave = () => tl.play();
      marqueeRef.current.addEventListener("mouseenter", onEnter);
      marqueeRef.current.addEventListener("mouseleave", onLeave);

      return () => {
        marqueeRef.current?.removeEventListener("mouseenter", onEnter);
        marqueeRef.current?.removeEventListener("mouseleave", onLeave);
      };
    }, marqueeRef);

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <section
      ref={marqueeRef}
      aria-hidden
      className={`relative z-10 mx-auto mt-[-32px] max-w-6xl overflow-hidden px-4 pb-2 ${className}`}
    >
      <div className={`marquee-row flex min-w-[200%] select-none ${gapClass} whitespace-nowrap opacity-70`}>
        {[...items, ...items].map((text, i) => (
          <div
            key={i}
            className={`text-sm ${uppercase ? "uppercase tracking-[0.25em]" : ""} text-neutral-400`}
          >
            {text} {bullet}
          </div>
        ))}
      </div>
    </section>
  );
}
