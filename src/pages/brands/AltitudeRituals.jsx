import React from "react";
import { BRANDS } from "../../brandsData";
import { Link } from "react-router-dom";

const data = BRANDS.find(b => b.slug === "altitude-rituals");

export default function BrandAltitude() {
  if (!data) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">Presentación de marca</p>
          <h1 className="mt-3 text-5xl font-semibold md:text-6xl">{data.name}</h1>
          <p className="mt-6 text-neutral-300">{data.long || data.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-300">
            {data.tags.map(t => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">{t}</span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a href={data.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm">
              Visitar sitio ↗
            </a>
            <Link to="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-200">Volver a marcas</Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-3">
          <img src={data.image} alt={data.name} className="h-full w-full rounded-2xl object-cover" />
        </div>
      </div>

      {/* Secciones opcionales */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card title="Propósito" text="Inspirado en el cielo, nutrido por la tierra" />
        <Card title="Pilares" list={["Producto con significado", "Diseño atemporal", "Experiencia consistente"]} />
        <Card title="Etiquetas" chips={data.tags} />
      </div>
    </section>
  );
}

function Card({ title, text, list, chips }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      {text && <p className="text-neutral-300">{text}</p>}
      {list && (
        <ul className="list-disc pl-5 text-neutral-300">
          {list.map(i => <li key={i}>{i}</li>)}
        </ul>
      )}
      {chips && (
        <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 mt-1">
          {chips.map(c => <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">{c}</span>)}
        </div>
      )}
    </div>
  );
}
