import React from "react";

export default function About({ id = "about" }) {
  return (
    <section id={id} className="about-section relative mx-auto max-w-6xl px-4 pb-24">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-semibold md:text-4xl">Sobre el holding</h2>
          <p className="mt-4 max-w-prose text-neutral-300">
            Belleza consciente, movimiento inteligente, innovación sostenible.
            <br />
            <br />
            Somos un holding que conecta tres dimensiones esenciales del bienestar moderno:
            <br />
            <br />
            - Dermocosmética de alto estándar, creada para cuidar la piel con ciencia,
            sensibilidad y respeto por el entorno. <br />
            - Soluciones de viaje prácticas y elegantes, pensadas para acompañar cuerpos en
            movimiento con comodidad, estilo y ritual. <br />
            - Innovación en gestión de residuos, transformando desafíos ambientales en
            oportunidades de impacto positivo.
            <br />
            <br />
            Cada línea responde a una misma visión: crear productos que cuiden, acompañen y
            transformen. Porque creemos que el bienestar personal, la movilidad consciente y
            el respeto por el planeta no son caminos separados, sino parte de una misma historia.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-sm text-neutral-300">
          <h3 className="mb-3 text-base font-semibold text-white">Contacto</h3>
          <p className="mb-3">¿Interesado en colaborar o invertir?</p>
          <a
            href="#"
            className="magnet inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm hover:border-[rgba(var(--accent-rgb),.35)] hover:bg-[rgba(var(--accent-rgb),.06)]"
          >
            <span>Escríbenos</span>
          </a>
        </div>
      </div>
    </section>
  );
}
