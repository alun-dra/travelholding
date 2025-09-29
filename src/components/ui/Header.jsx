// components/ui/Header.jsx
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Header({
  brand = "737LAB",
  links = [
    { label: "Marcas", href: "/#brands" },
    { label: "Nosotros", href: "/#about" },
  ],
  fixed = true,
  right = null,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const positionClass = fixed ? "fixed" : "sticky";

  // Bloquear/desbloquear scroll cuando el panel móvil cambia
  useEffect(() => {
    const body = document.body;
    const prev = body.style.overflow;
    if (open) body.style.overflow = "hidden";
    else body.style.overflow = prev || "";
    return () => (body.style.overflow = prev || "");
  }, [open]);

  // Cerrar al cambiar ruta o hash (#brands, #about)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cerrar si cambia a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cerrar al hacer scroll (evita que “quede abierto” al desplazarse)
  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      className={`
        ${positionClass} inset-x-0 top-0 z-[90] ${className}
        bg-black/90 backdrop-blur-sm border-b border-white/10
      `}
      style={{
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
      }}
    >
      {/* Barra superior */}
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
        <a href="#top" className="text-base md:text-lg font-semibold tracking-tight text-white">
          {brand}
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="transition hover:text-white hover:underline underline-offset-4"
            >
              {label}
            </a>
          ))}
        </nav>

        {right && <div className="ml-4 hidden md:flex items-center">{right}</div>}

        {/* Hamburguesa */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-neutral-200 hover:bg-white/5 active:bg-white/10 transition"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* SCRIM (tocar fuera cierra) */}
      <button
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`
          md:hidden fixed inset-0 z-[80] bg-black/50 transition-opacity
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Panel móvil BLANCO */}
      <div
        className={`
          md:hidden fixed inset-x-0 top-14 z-[85]
          px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]
          transition-all duration-200
          ${open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"}
        `}
        aria-hidden={!open}
      >
        <div className="
          mx-auto max-w-6xl rounded-b-xl border border-black/10 border-t-0
          bg-white text-neutral-900 shadow-[0_12px_30px_-12px_rgba(0,0,0,.5)]
        ">
          <nav className="flex flex-col p-2">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-[15px] hover:bg-neutral-100"
              >
                {label}
              </a>
            ))}
          </nav>

          {right && <div className="px-3 pb-3">{right}</div>}
        </div>
      </div>
    </header>
  );
}
