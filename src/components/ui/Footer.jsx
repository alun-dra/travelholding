import React from "react";

/**
 * Footer básico del sitio.
 * - brand: se muestra junto al año
 * - year: por defecto el actual
 * - children: contenido extra opcional (links, redes, etc.)
 */
export default function Footer({
  brand = "737LAB",
  year = new Date().getFullYear(),
  children = null,
  className = "",
}) {
  return (
    <footer className={`border-t border-white/10 py-10 text-center text-sm text-neutral-400 ${className}`}>
      {children ? (
        children
      ) : (
        <p>© {year} {brand}</p>
      )}
    </footer>
  );
}
