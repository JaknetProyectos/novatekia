"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { getOptimizedUrl } from "@/lib/images";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-amber-500 border-b py-16 border-amber-600/40 text-zinc-950">
      {/* Detalle geométrico rectilíneo de fondo (Patrón de grilla sobrio) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Foto flotante a la derecha en pantallas medianas y grandes */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] items-center justify-end pr-8 md:flex">
        <div className="relative h-[85%] w-full max-w-2xl border-2 border-red-950/20 bg-amber-400/40 p-2">
          <img
            src={getOptimizedUrl("https://images.unsplash.com/photo-1758518726324-62bef7c815b0?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")}
            alt={t("imageAlt")}
            className="h-full w-full object-cover object-center contrast-125 border border-red-950/30"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-6 px-4 sm:px-6 lg:px-12 relative z-10 grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,620px)_1fr]">
        <div className="flex flex-col items-start">

          {/* TÍTULO PRINCIPAL */}
          <h1 className="text-5xl font-black tracking-tight text-red-950 sm:text-6xl lg:text-7xl leading-[0.95]">
            {t("title")}
          </h1>

          {/* SUBTÍTULO EN BOLD */}
          <p className="mt-4 text-xl font-bold uppercase tracking-wide text-red-900 sm:text-2xl border-l-4 border-red-950 pl-4 py-0.5">
            {t("subtitle")}
          </p>

          {/* DESCRIPCIÓN */}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-900 font-medium">
            {t("description")}
          </p>


          {/* ACCIONES / BOTONES GUINDA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-3 bg-red-950 text-amber-300 font-mono text-xs uppercase tracking-widest font-bold px-7 py-4 border border-red-900 hover:bg-red-900 hover:text-amber-200 transition-all shadow-lg active:translate-y-0.5"
            >
              <span>{t("ctaLearnMore")}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 border-2 border-red-950 bg-transparent text-red-950 font-mono text-xs uppercase tracking-widest font-bold px-7 py-3.5 hover:bg-red-950 hover:text-amber-400 transition-colors"
            >
              {t("ctaServices")}
            </Link>
          </div>
        </div>

        {/* Espaciador para la columna derecha en desktop */}
        <div className="hidden lg:block" />
      </div>

      {/* Imagen para móvil */}
      <div className="relative z-10 px-4 pb-12 md:hidden">
        <div className="border-2 border-red-950/20 bg-amber-400/40 p-2">
          <img 
            src={getOptimizedUrl("https://images.unsplash.com/photo-1758518726324-62bef7c815b0?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")} 
            alt={t("imageAlt")} 
            className="w-full h-auto object-cover border border-red-950/30 contrast-125" 
          />
        </div>
      </div>
    </section>
  );
}