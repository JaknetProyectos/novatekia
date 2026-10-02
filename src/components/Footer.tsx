"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Home,
  Users,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Shield,
  RefreshCw,
  FileText,
  CreditCard,
} from "lucide-react";
import { site } from "@/data/site";

export default function Footer() {
  const t = useTranslations("footer");

  const nav = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.about"), href: "/nosotros", icon: Users },
    { label: t("nav.services"), href: "/servicios", icon: Briefcase },
    { label: t("nav.contact"), href: "/contacto", icon: Mail },
  ];

  const legalLinks = [
    { label: t("legal.privacy"), href: "/politica-privacidad", icon: Shield },
    { label: t("legal.refund"), href: "/politica-rembolso", icon: RefreshCw },
    { label: t("legal.terms"), href: "/terminos-condiciones", icon: FileText },
  ];

  return (
    <footer className="bg-zinc-950 text-amber-300 border-t border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">

        {/* SECCIÓN PRINCIPAL: GRID RESPONSIVO */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-12 pb-12 border-b border-amber-500/20">

          {/* COLUMNA 1: NAVEGACIÓN Y ACCESOS */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 border-l-2 border-amber-400 pl-3">
              {t("sections.access")}
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-xs uppercase font-mono tracking-wider">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2.5 text-amber-200/80 hover:text-amber-400 transition-colors group"
                    >
                      <Icon size={14} className="text-amber-500 group-hover:text-amber-400 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMNA 2: INFORMACIÓN DE CONTACTO */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 border-l-2 border-amber-400 pl-3">
              {t("sections.contact")}
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-xs font-mono text-amber-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  {site.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2.5 text-amber-200/80 hover:text-amber-400 transition-colors"
              >
                <Mail size={15} className="text-amber-500 shrink-0" />
                <span>{site.email}</span>
              </a>

              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 text-amber-200/80 hover:text-amber-400 transition-colors"
              >
                <Phone size={15} className="text-amber-500 shrink-0" />
                <span>{site.phone}</span>
              </a>
            </div>
          </div>

          {/* COLUMNA 3: BRANDING Y LOGO */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between gap-6">
            <div className="border border-amber-500/30 bg-red-950/20 p-4">
              <img
                src="/title.png"
                alt={t("logoAlt")}
                className="h-12 invert brightness-0 w-auto object-contain"
              />
            </div>

            <p className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-400 transition-colors">
              <CreditCard size={14} className="text-amber-500 group-hover:text-amber-400 shrink-0" />
              <span>{t("weAccept")}</span>
            </p>

            <div className="border border-amber-500/30 bg-red-950/20 p-4">
              <img
                src="/cards.png"
                alt={t("cardsAlt")}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: COPYRIGHT Y LEGALES (FLEX RESPONSIVO) */}
        <div className="pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] font-mono text-amber-300/60 uppercase tracking-wider">
            {t("copyright")}
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-mono uppercase tracking-wider">
            {legalLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-amber-300/70 hover:text-amber-400 transition-colors"
                  >
                    <Icon size={12} className="text-amber-500" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </footer>
  );
}