// components/ui/Footer.jsx
import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";

export default function Footer({
  brand = "737LAB",
  fixed = false,
  nav = [
    { label: "Inicio", href: "/" },
    { label: "Marcas", href: "/#brands" },
    { label: "Nosotros", href: "/#about" },
    { label: "Contacto", href: "/#contact" },
  ],
  className = "",
}) {
  const ref = useRef(null);

  // publica --footer-h solo si es fixed
  useLayoutEffect(() => {
    const shell = document.getElementById("top");
    if (!shell) return;
    if (!fixed) {
      shell.style.setProperty("--footer-h", "0px");
      return;
    }
    const setH = () => {
      const h = ref.current?.getBoundingClientRect().height || 0;
      shell.style.setProperty("--footer-h", `${Math.ceil(h)}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [fixed]);

  useEffect(() => {
    const shell = document.getElementById("top");
    if (!shell) return;
    if (!shell.style.getPropertyValue("--footer-h")) {
      shell.style.setProperty("--footer-h", "0px");
    }
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      aria-label="Pie de página"
      className={`${className} left-0 right-0 ${
        fixed ? "fixed bottom-0 z-40 rounded-t-2xl" : "relative"
      }`}
      data-fixed={fixed ? "true" : "false"}
    >
      <div
        className="
          mx-auto max-w-6xl rounded-t-2xl
          bg-white/[0.035] backdrop-blur
          px-5 md:px-8 py-6 md:py-8
          
          shadow-[0_-24px_80px_-40px_rgba(0,0,0,.55)]
        "
      >
        {/* top: marca + redes */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <a
              href="#top"
              className="inline-block text-[20px] font-semibold tracking-tight"
            >
              {brand}
            </a>
            {/* <p className="mt-1 text-sm text-neutral-300/90">
              Arquitectura de marcas y experiencias para personas y negocios.
            </p> */}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <IconPill label="Instagram" href="https://instagram.com/" Icon={Instagram} />
            <IconPill label="LinkedIn" href="https://linkedin.com/" Icon={Linkedin} />
            <IconPill label="YouTube" href="https://youtube.com/" Icon={Youtube} />
          </div>
        </div>

        {/* hairline gradient divider */}
        <div
          className="my-6 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.10) 10%, rgba(255,255,255,.10) 90%, transparent)",
          }}
        />

        {/* columnas */}
        <div
          className="
            grid gap-10 md:grid-cols-4
            md:[&>section:not(:first-child)]:border-l md:[&>section:not(:first-child)]:border-white/10
            md:[&>section:not(:first-child)]:pl-8
          "
        >
          {/* navegación */}
          <section>
            <SectionEyebrow>Navegación</SectionEyebrow>
            <ul className="mt-3 space-y-2 text-[15px] leading-7 text-neutral-200">
              {nav.map((l) => (
                <li key={l.href}>
                  <a className="transition hover:text-white/95" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* contacto */}
          <section>
            <SectionEyebrow>Contacto</SectionEyebrow>
            <ul className="mt-3 space-y-2 text-[15px] leading-7 text-neutral-200">
              <li className="flex items-center gap-2">
                <Mail size={16} className="opacity-70" />
                <a className="hover:text-white/95 transition" href="mailto:hola@737lab.com">
                  hola@737lab.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="opacity-70" />
                <a className="hover:text-white/95 transition" href="tel:+56912345678">
                  +56 9 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="opacity-70" />
                <span>Santiago, Chile</span>
              </li>
            </ul>
          </section>

          {/* newsletter minimal */}
          <section>
            <SectionEyebrow>Novedades</SectionEyebrow>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias! Te avisaremos de novedades ✨");
              }}
              className="mt-3"
            >
              <label className="block text-sm text-neutral-400 mb-2">
                Recibe lanzamientos y artículos.
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  required
                  placeholder="Tu email"
                  className="
                    w-full bg-transparent outline-none
                    border-b border-white/15 focus:border-white/35
                    text-[15px] py-2 placeholder:text-neutral-500
                  "
                />
                <button
                  type="submit"
                  className="
                    inline-flex items-center rounded-full
                    border border-white/12 bg-white/[0.05]
                    px-4 py-1.5 text-sm
                    transition hover:border-white/30 hover:bg-white/[0.10]
                  "
                >
                  Suscribirme
                </button>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Sin spam. Puedes darte de baja cuando quieras.
              </p>
            </form>
          </section>

          {/* legal */}
          <section>
            <SectionEyebrow>Legal</SectionEyebrow>
            <ul className="mt-3 space-y-2 text-[15px] leading-7 text-neutral-200">
              <li><a href="/terminos" className="hover:text-white/95 transition">Términos</a></li>
              <li><a href="/privacidad" className="hover:text-white/95 transition">Privacidad</a></li>
              <li><a href="/cookies" className="hover:text-white/95 transition">Cookies</a></li>
            </ul>
          </section>
        </div>

        {/* meta */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-neutral-400 md:flex-row">
          <p>© {year} {brand}. Todos los derechos reservados.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
              inline-flex items-center gap-1 rounded-full
              border border-white/12 bg-white/[0.05]
              px-3 py-1 uppercase tracking-wide
              hover:border-white/30 hover:bg-white/[0.10] transition
            "
            aria-label="Volver arriba"
          >
            <ArrowUp size={14} /> Volver arriba
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ---- Helpers elegantes ---- */
function SectionEyebrow({ children }) {
  return (
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
      {children}
    </h4>
  );
}

function IconPill({ label, href, Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="
        inline-grid h-9 w-9 place-items-center rounded-full
        border border-white/12 bg-white/[0.05]
        hover:border-white/30 hover:bg-white/[0.10] transition
      "
    >
      <Icon size={16} className="opacity-90" />
    </a>
  );
}
