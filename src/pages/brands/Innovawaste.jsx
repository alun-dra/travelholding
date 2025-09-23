import React from "react";
import { BRANDS } from "../../brandsData";
import { Link } from "react-router-dom";

const data = BRANDS.find(b => b.slug === "innovawaste");

export default function BrandInnovawaste() {
  if (!data) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-10">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h1 className="text-5xl font-semibold md:text-6xl">{data.name}</h1>
          <p className="mt-4 text-neutral-300">{data.long || data.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-300">
            {data.tags.map(t => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">{t}</span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a href={data.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm">
              Visitar sitio ↗
            </a>
            <Link to="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-200">
              Volver a marcas
            </Link>
          </div>
        </div>

        <div className="order-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-3 md:order-2">
          <img src={data.image} alt={data.name} className="h-full w-full rounded-2xl object-cover" />
        </div>
      </div>
    </section>
  );
}
