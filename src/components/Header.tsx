"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Home,
  Users,
  Briefcase,
  Mail,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { site } from "@/data/site";
import { useCart } from "@/context/cart-context";
import { useLocaleContext } from "@/context/lang-context";

export default function Header() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();
  const { switchLanguage, isPending, locale } = useLocaleContext();

  const nav = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.about"), href: "/nosotros", icon: Users },
    { label: t("nav.services"), href: "/servicios", icon: Briefcase },
    { label: t("nav.contact"), href: "/contacto", icon: Mail },
  ];

  const handleLanguageChange = (newLang: "es" | "en") => {
    switchLanguage(newLang);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-red-950 border-b border-amber-500/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex h-20 items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="shrink-0 group" aria-label={site.name}>
          <img
            src={"/title.png"}
            alt={t("logoAlt")}
            className="h-12 invert brightness-0 w-auto md:h-11 transition-opacity duration-200 group-hover:opacity-90"
          />
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 text-xs uppercase tracking-widest font-medium transition-colors py-2 ${
                  active
                    ? "text-amber-400 font-semibold"
                    : "text-amber-200/80 hover:text-amber-400"
                }`}
              >
                <Icon size={15} className={active ? "text-amber-400" : "text-amber-300/60"} />
                <span>{item.label}</span>

                {/* Indicador inferior rectangular recto */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}

          <div className="h-4 w-px bg-amber-500/20 my-auto" />

          {/* CARRITO CON VISIBILIDAD DE COUNT CORREGIDA */}
          <Link
            href="/carrito"
            aria-label={t("cart")}
            className="relative flex items-center gap-2.5 text-xs uppercase tracking-widest font-medium text-amber-200/80 hover:text-amber-400 transition-colors py-1.5 px-3 border border-amber-500/30 bg-black/40 hover:border-amber-400"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart size={18} className="text-amber-400" />
              {itemCount > 0 && (
                <span className="absolute -top-3 -right-3 z-10 bg-amber-500 text-zinc-950 font-bold text-[10px] min-w-[18px] h-[18px] flex items-center justify-center px-1 font-mono border border-zinc-950">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">{t("cart")}</span>
          </Link>

          {/* SELECTOR DE IDIOMA DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 border border-amber-500/30 bg-black/40 px-3 py-1.5 text-[11px] font-mono tracking-wider text-amber-300 hover:border-amber-400 transition-colors disabled:opacity-50"
            >
              <img
                src={locale === "en" ? site.flagUs : site.flagMx}
                alt={locale === "en" ? "US" : "MX"}
                className="h-3 w-4.5 object-cover"
              />
              <span>{locale.toUpperCase()}</span>
              <ChevronDown size={13} className={`text-amber-400 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 border border-amber-500/30 bg-black/90 backdrop-blur-md shadow-lg z-50">
                <button
                  type="button"
                  onClick={() => handleLanguageChange("es")}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-[11px] font-mono text-left transition-colors hover:bg-amber-500/10 ${
                    locale === "es" ? "text-amber-400 font-bold" : "text-amber-200/80"
                  }`}
                >
                  <img src={site.flagMx} alt="MX" className="h-3 w-4.5 object-cover" />
                  <span>ES</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("en")}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-[11px] font-mono text-left transition-colors hover:bg-amber-500/10 ${
                    locale === "en" ? "text-amber-400 font-bold" : "text-amber-200/80"
                  }`}
                >
                  <img src={site.flagUs} alt="US" className="h-3 w-4.5 object-cover" />
                  <span>EN</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("openMenu")}
          className="flex items-center justify-center p-2 text-amber-300 border border-amber-500/30 bg-black/40 lg:hidden hover:border-amber-400"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MENÚ MÓVIL FULLSCREEN CON FONDO SÓLIDO (SIN TRANSPARENCIA) */}
      <div
        className={`fixed inset-0 z-50 bg-black text-zinc-100 transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-20 items-center justify-between border-b border-amber-500/20 bg-red-950">
          <img
            src={"/title.png"}
            alt={t("logoAlt")}
            className="h-12 invert brightness-0 w-auto"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            className="p-2 text-amber-400 border border-amber-500/30 bg-black/40"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="px-6 flex bg-black flex-col gap-1 py-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 border-b border-zinc-800/80 py-5 text-lg font-light uppercase tracking-widest transition-colors ${
                  active
                    ? "text-amber-400 pl-2 border-l-2 border-amber-400"
                    : "text-zinc-300 hover:text-amber-400"
                }`}
              >
                <Icon size={20} className="text-amber-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Carrito en menú móvil con badge destacado */}
          <Link
            href="/carrito"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-b border-zinc-800/80 py-5 text-lg font-light uppercase tracking-widest text-zinc-300 hover:text-amber-400"
          >
            <div className="flex items-center gap-4">
              <ShoppingCart size={20} className="text-amber-500" />
              <span>{t("cart")}</span>
            </div>
            {itemCount > 0 && (
              <span className="bg-amber-500 text-zinc-950 font-bold text-xs px-2.5 py-0.5 font-mono border border-zinc-950">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Selector de idioma en menú móvil */}
          <div className="flex items-center justify-around py-5 border-b border-zinc-800/80">
            <button
              type="button"
              onClick={() => handleLanguageChange("es")}
              className={`flex items-center gap-2 px-4 py-2 border ${
                locale === "es" ? "border-amber-400 text-amber-400" : "border-zinc-800 text-zinc-400"
              }`}
            >
              <img src={site.flagMx} alt="MX" className="h-3 w-4.5 object-cover" />
              <span>Español</span>
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`flex items-center gap-2 px-4 py-2 border ${
                locale === "en" ? "border-amber-400 text-amber-400" : "border-zinc-800 text-zinc-400"
              }`}
            >
              <img src={site.flagUs} alt="US" className="h-3 w-4.5 object-cover" />
              <span>English</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}