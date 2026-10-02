"use client";

import { useTranslations } from "next-intl";

export default function BenefitsSection() {
  const t = useTranslations("benefitsSection");

  const benefitKeys = ["one", "two", "three", "four", "five"] as const;

  return (
    <section className="bg-zinc-950 text-amber-400 py-16 md:py-24 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ENCABEZADO */}
        <div className="flex flex-col items-start border-l-4 border-amber-400 pl-4 py-1 mb-12 md:mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-500">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight text-amber-400 sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
        </div>

        {/* REJILLA RESPONSIVA EN GRID (SIN MARGENES ESCALONADOS FLOTANTES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {benefitKeys.map((key) => (
            <article
              key={key}
              className="flex flex-col justify-between border border-amber-500/20 bg-zinc-900/60 p-6 md:p-8 hover:border-amber-400/60 transition-colors"
            >
              <div>
                {/* LÍNEA SUPERIOR DE SEPARACIÓN */}
                <div className="h-0.5 w-12 bg-amber-400 mb-6" />

                {/* ÍNDICE EN FUENTE MONOESPACIADA */}
                <span className="text-xs uppercase font-mono tracking-widest text-amber-500 font-bold">
                  {t(`items.${key}.index`)}
                </span>

                {/* TÍTULO */}
                <h3 className="mt-3 text-xl font-bold tracking-tight text-amber-300 leading-snug sm:text-2xl">
                  {t(`items.${key}.title`)}
                </h3>

                {/* TEXTO */}
                <p className="mt-4 text-sm leading-relaxed text-amber-100/70 font-normal">
                  {t(`items.${key}.text`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}