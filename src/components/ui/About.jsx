// components/sections/About.jsx
import React, { useState } from "react";

export default function About({ id = "about" }) {
  return (
    <section
      id={id}
      className="relative mx-auto max-w-6xl px-4 pb-28 pt-10"
      style={{
        ["--bio-blue-rgb"]: "126,187,255",
        ["--bio-violet-rgb"]: "167,139,250",
      }}
    >
      {/* fondos sutiles, sin discos duros */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-28 -top-24 h-[58vmin] w-[58vmin] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(55% 50% at 50% 50%, rgba(var(--bio-violet-rgb),.22), transparent 66%)",
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 50% 50%, black 60%, transparent 100%)",
            maskImage:
              "radial-gradient(60% 60% at 50% 50%, black 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute -right-24 top-10 h-[52vmin] w-[52vmin] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(55% 50% at 45% 45%, rgba(var(--bio-blue-rgb),.18), transparent 66%)",
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 50% 50%, black 60%, transparent 100%)",
            maskImage:
              "radial-gradient(60% 60% at 50% 50%, black 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* texto */}
        <div className="md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
            Sobre el holding
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
            Belleza consciente, movimiento inteligente, innovación sostenible.
          </h2>

          <p className="mt-5 max-w-[65ch] text-neutral-300 leading-relaxed">
            Somos un holding que conecta tres dimensiones esenciales del bienestar moderno:
          </p>

          <ul className="mt-5 space-y-4 text-neutral-300 leading-relaxed">
            <Bullet>
              Dermocosmética de alto estándar, creada para cuidar la piel con ciencia,
              sensibilidad y respeto por el entorno.
            </Bullet>
            <Bullet>
              Soluciones de viaje prácticas y elegantes, pensadas para acompañar cuerpos en
              movimiento con comodidad, estilo y ritual.
            </Bullet>
            <Bullet>
              Innovación en gestión de residuos, transformando desafíos ambientales en
              oportunidades de impacto positivo.
            </Bullet>
          </ul>

          <p className="mt-6 max-w-[68ch] text-neutral-300 leading-relaxed">
            Cada línea responde a una misma visión: crear productos que cuiden, acompañen y
            transformen. Porque creemos que el bienestar personal, la movilidad consciente y
            el respeto por el planeta no son caminos separados, sino parte de una misma historia.
          </p>
        </div>

        {/* tarjeta contacto */}
        <ContactCard />
      </div>
    </section>
  );
}

/* — helpers — */

function Bullet({ children }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(var(--bio-blue-rgb),.95), rgba(var(--bio-blue-rgb),.55))",
          boxShadow: "0 0 10px rgba(var(--bio-blue-rgb),.40)",
        }}
      />
      <span className="block">{children}</span>
    </li>
  );
}

function ContactCard() {
  const [spot, setSpot] = useState({ x: -999, y: -999 });

  return (
    <aside
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setSpot({ x: -999, y: -999 })}
      className="
        group relative overflow-hidden rounded-3xl
        border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6
        shadow-[inset_0_1px_0_rgba(255,255,255,.06)]
        text-sm text-neutral-300
        flex flex-col h-full
      "
      style={{ ["--mx"]: `${spot.x}px`, ["--my"]: `${spot.y}px` }}
    >
      {/* mild spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px 200px at var(--mx) var(--my), rgba(var(--bio-violet-rgb),.14), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      <h3 className="relative z-10 mb-3 text-base font-semibold text-white">
        Contacto
      </h3>
      <p className="relative z-10 mb-5">
        ¿Interesado en colaborar o invertir? Escríbenos aquí:
      </p>

      {/* Formulario ocupa todo y empuja el botón al fondo */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("¡Gracias! Te responderemos pronto ✨");
        }}
        className="relative z-10 flex flex-col gap-3 flex-1"
      >
        <input
          type="email"
          required
          placeholder="Tu correo"
          className="
            w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm
            placeholder:text-neutral-400 text-white
            focus:border-[rgba(var(--bio-blue-rgb),.45)] focus:ring-0 outline-none
          "
        />
        <textarea
          rows={5}
          required
          placeholder="Tu mensaje"
          className="
            w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm
            placeholder:text-neutral-400 text-white resize-none
            focus:border-[rgba(var(--bio-blue-rgb),.45)] focus:ring-0 outline-none
          "
        />

        {/* Botón siempre en el bottom */}
        <button
          type="submit"
          className="
            mt-auto w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium
            transition hover:border-[rgba(var(--bio-blue-rgb),.45)]
            hover:bg-[rgba(var(--bio-blue-rgb),.12)]
          "
        >
          Enviar
        </button>
      </form>
    </aside>
  );
}
