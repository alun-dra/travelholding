import React from "react";

/**
 * Header de sitio.
 * - brand: texto del logo
 * - links: [{ label, href }]
 * - fixed: si va fijo arriba (default) o sticky
 * - right: slot para contenido a la derecha (ej: ProgressCircle)
 */
export default function Header({
  brand = "737LAB",
  links = [
    { label: "Marcas", href: "#brands" },
    { label: "Nosotros", href: "#about" },
  ],
  fixed = true,
  right = null,
  className = "",
}) {
  const positionClass = fixed ? "fixed" : "sticky";
  return (
    <header className={`${positionClass} left-0 right-0 top-0 z-50 ${className}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-9">
        <a href="#top" className="font-semibold tracking-tight">
          {brand}
        </a>

        <nav className="flex items-center gap-6 text-sm text-neutral-300">
          {links.map(({ label, href }) => (
            <a key={href} href={href} className="transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        {right && <div className="ml-4 flex items-center">{right}</div>}
      </div>
    </header>
  );
}
