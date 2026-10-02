"use client";

import { useTranslations } from "next-intl";
import {
  Briefcase,
  Compass,
  FileVideo,
  Layers,
  MonitorSmartphone,
  Users,
} from "lucide-react";

export type FeatureIcon =
  | "layers"
  | "devices"
  | "briefcase"
  | "file"
  | "users"
  | "compass";

const iconMap: Record<FeatureIcon, typeof Layers> = {
  layers: Layers,
  devices: MonitorSmartphone,
  briefcase: Briefcase,
  file: FileVideo,
  users: Users,
  compass: Compass,
};

export default function FeaturesSection() {
  const t = useTranslations("features");

  const featureKeys: { icon: FeatureIcon; key: string }[] = [
    { icon: "layers", key: "onlineMode" },
    { icon: "devices", key: "flexibleDuration" },
    { icon: "briefcase", key: "practicalContent" },
    { icon: "file", key: "downloadableMaterials" },
    { icon: "users", key: "businessApproach" },
    { icon: "compass", key: "cultureAndValues" },
  ];

  return (
    <section className="bg-red-950 py-16 md:py-24 border-b border-amber-500/20 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* COLUMNA IZQUIERDA: Encabezado */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-amber-400 leading-tight border-l-4 border-amber-400 pl-4">
            {t("title")}
          </h2>
          <p className="mt-6 text-sm sm:text-base leading-relaxed text-amber-100/90 max-w-lg font-normal">
            {t.rich("description", {
              company: (chunks) => (
                <span className="font-bold text-amber-300">{chunks}</span>
              ),
            })}
          </p>
        </div>

        {/* COLUMNA DERECHA: Lista con Grid */}
        <div className="lg:col-span-7 border-t border-amber-500/30">
          <ul className="flex flex-col">
            {featureKeys.map(({ icon, key }) => {
              const Icon = iconMap[icon];
              return (
                <li
                  key={key}
                  className="group grid grid-cols-1 sm:grid-cols-12 items-start gap-4 sm:gap-6 border-b border-amber-500/20 py-6 sm:py-8 transition-colors hover:bg-black/20 px-2"
                >
                  <div className="sm:col-span-2 flex items-center justify-start text-amber-400">
                    <Icon size={32} strokeWidth={1.5} className="text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <h3 className="sm:col-span-4 text-sm font-bold uppercase tracking-wider text-amber-300 leading-snug">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="sm:col-span-6 text-xs sm:text-sm leading-relaxed text-amber-100/80 font-light">
                    {t(`items.${key}.text`)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </section>
  );
}