import React, { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined" && gsap && !gsap.core.globals()["ScrollTrigger"]) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProgressCircle({
  size = 84,
  r = 36,
  track = "#2A2A2A",
  stroke = "rgba(var(--accent-rgb), 0.95)",
  /** "overlay" = flotante fijo en viewport, "inline" = para ir dentro del Header sin alterar su altura */
  placement = "overlay",
  className = "",
}) {
  const circleRef = useRef(null);
  const circ = useMemo(() => 2 * Math.PI * r, [r]);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
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
    return () => st.kill();
  }, [circ]);

  const base =
    "pointer-events-none opacity-90 [filter:drop-shadow(0_2px_8px_rgba(0,0,0,.35))]";
  const overlayPos =
    "fixed right-4 top-4 md:right-5 md:top-5 z-50 h-12 w-12 md:h-14 md:w-14";
  const inlinePos =
    "absolute right-3 top-1/2 -translate-y-1/2 z-50 h-10 w-10 md:h-12 md:w-12";

  const wrapperCls =
    placement === "overlay"
      ? `${base} ${overlayPos} ${className}`
      : `${base} ${inlinePos} ${className}`;

  return (
    <div className={wrapperCls} aria-hidden>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth="6" fill="none" />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{ stroke }}
        />
      </svg>
    </div>
  );
}
