"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckSquare } from "lucide-react";

export default function CustomPlanBand() {
  const t = useTranslations("customPlan");

  return (
    <section className="bg-[#450a0a] py-16 md:py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        
        {/* COLUMNA DE TEXTO */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl leading-none">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg font-medium text-zinc-200 sm:text-xl">
            {t("subtitle")}
          </p>
        </div>

        {/* COLUMNA DE BOTONES */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-4 w-full">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold px-7 py-4 border border-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <span>{t("requestPlan")}</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/paquete-personalizado"
            className="inline-flex items-center justify-center gap-2 border-2 border-zinc-950 bg-amber-200/80 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold px-7 py-4 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
          >
            <CheckSquare size={16} />
            <span>{t("alreadyHavePlan")}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}