"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { site } from "@/data/site";

export default function QuoteSection() {
  const t = useTranslations("quoteSection");

  return (
    <section className="relative bg-zinc-950 border-y border-amber-500/30 text-amber-400 py-20 md:py-28 overflow-hidden">
      {/* Contenedor principal responsive con CSS Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Gráfica ornamental waves estructurada con flex */}
        {site.waves && (
          <div className="lg:col-span-12 flex justify-start pointer-events-none opacity-20 select-none">
            <img
              src={site.waves}
              alt=""
              aria-hidden
              className="h-12 w-auto object-contain"
            />
          </div>
        )}

        {/* Bloque de la Cita */}
        <div className="lg:col-span-10 flex flex-col gap-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug tracking-tight text-amber-300 flex flex-col sm:flex-row items-start gap-4">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-8 w-8 shrink-0 fill-amber-400 mt-1"
            >
              <path d="M12 0c.6 5.6 5.8 10.8 12 12-6.2 1.2-11.4 6.4-12 12-.6-5.6-5.8-10.8-12-12C6.2 10.8 11.4 5.6 12 0Z" />
            </svg>
            <span>
              {t("quote")}
            </span>
          </h2>

          {/* Bloque del Call to Action */}
          <div className="pt-6 border-t border-amber-500/20 flex items-center">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400">
              {t.rich("cta", {
                link: (chunks) => (
                  <Link
                    href="/contacto"
                    className="text-amber-300 underline decoration-2 underline-offset-8 transition-colors hover:text-amber-100 hover:decoration-amber-400"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}