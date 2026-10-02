"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    altKey: "gallery.image1Alt",
  },
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    altKey: "gallery.image2Alt",
  },
];

const GRID_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    altKey: "grid.image1Alt",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    altKey: "grid.image2Alt",
  },
];

const QUOTE_BG_IMAGE =
  "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600&auto=format&fit=crop";

export default function AboutSection() {
  const t = useTranslations("about");

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-screen py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans">
      
      {/* LUZ AMBIENTAL SUTIL (SIN GRADIENTES, BLUR SUTIL EN GUINDA) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#800020]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24 lg:space-y-32">
        
        {/* ==========================================
            SECCIÓN 1: NOSOTROS (2 COLUMNAS)
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: TEXTO DE NOSOTROS */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <p className="text-amber-500 font-medium tracking-[0.2em] text-xs uppercase mb-3">
                {t("section1.subtitle")}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-zinc-100 uppercase leading-tight">
                {t("section1.title")}
              </h1>
            </div>

            <p className="text-xl sm:text-2xl font-light text-amber-500/90 leading-relaxed border-l-2 border-[#800020] pl-6 py-1">
              {t("section1.highlight")}
            </p>

            <div className="w-full h-px bg-zinc-800 my-8" />

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light tracking-wide">
              {t("section1.description")}
            </p>
          </div>

          {/* COLUMNA DERECHA: PICTURE GALLERY */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GALLERY_IMAGES.map((img, idx) => (
              <div
                key={idx}
                className="relative h-72 sm:h-96 w-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden group"
              >
                <Image
                  src={img.src}
                  alt={t(img.altKey)}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 border border-amber-500/0 group-hover:border-amber-500/40 transition-colors pointer-events-none" />
              </div>
            ))}
          </div>

        </div>

        {/* ==========================================
            SECCIÓN 2: GRID DE 2 IMÁGENES (FULL WIDTH)
           ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {GRID_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="relative h-64 sm:h-80 lg:h-96 w-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={t(img.altKey)}
                fill
                className="object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500 ease-out"
              />
              <div className="absolute inset-0 border border-amber-500/0 group-hover:border-amber-500/30 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* ==========================================
            SECCIÓN 3: MOONEX’S PARTNERS (1 COLUMNA)
           ========================================== */}
        <div className="max-w-4xl mx-auto text-center space-y-8 backdrop-blur-md bg-zinc-900/30 p-8 sm:p-14 border border-zinc-800">
          <p className="text-amber-500 font-medium tracking-[0.2em] text-xs uppercase">
            {t("section3.subtitle")}
          </p>

          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-zinc-100 uppercase">
            {t("section3.title")}
          </h2>

          <div className="w-16 h-0.5 bg-amber-500 mx-auto" />

          <div className="space-y-6 text-sm sm:text-base text-zinc-300 font-light leading-relaxed tracking-wide text-justify sm:text-center">
            <p>{t("section3.paragraph1")}</p>
            <p>{t("section3.paragraph2")}</p>
          </div>
        </div>

        {/* ==========================================
            SECCIÓN 4: QUOTE CON IMAGEN DE FONDO
           ========================================== */}
        <div className="relative border border-zinc-800 overflow-hidden bg-zinc-950">
          {/* Imagen de fondo con overlay oscuro */}
          <div className="absolute inset-0 z-0">
            <Image
              src={QUOTE_BG_IMAGE}
              alt={t("quote.bgAlt")}
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs" />
          </div>

          {/* Contenido de la Cita */}
          <div className="relative z-10 p-8 sm:p-16 lg:p-20 max-w-5xl mx-auto text-center space-y-8 border-l-4 border-amber-500">
            <span className="block text-5xl sm:text-7xl font-serif text-amber-500/40 leading-none">
              “
            </span>

            <blockquote className="text-lg sm:text-2xl lg:text-3xl font-light text-zinc-100 leading-relaxed tracking-wide italic">
              {t("quote.text")}
            </blockquote>

            <div className="pt-4">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-500 font-medium">
                {t("quote.author")}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}