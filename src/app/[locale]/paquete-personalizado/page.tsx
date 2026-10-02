"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import {
  ArrowRight,
  CreditCard,
  FileText,
  Package2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { useCart } from "@/context/cart-context";

export default function CustomPackagePage() {
  const t = useTranslations("customPackagePage");

  const { addItem } = useCart();

  const [folio, setFolio] = useState("");
  const [amount, setAmount] = useState("");

  const numericAmount = useMemo(() => {
    const parsed = Number(amount);
    return isNaN(parsed) ? 0 : parsed;
  }, [amount]);

  const formattedTotal = useMemo(() => {
    return numericAmount.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [numericAmount]);

  const handleAddToCart = () => {
    if (!folio.trim()) return;
    if (numericAmount <= 0) return;

    addItem({
      id: 0,
      customPrice: numericAmount,
      meta: {
        customPackage: {
          description: `custom-package-${folio}-${Date.now()}`,
          id: 0,
          duration: "",
          image: "/logo.png",
          modality: "",
          notes: "",
          price: numericAmount,
          title: `${t("product.name")} - ${folio}`,
        },
      },
    });

    setFolio("");
    setAmount("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-red-950 text-amber-100">
      <div className="relative mt-20">
        {/* Background Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245,158,11,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245,158,11,0.2) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="relative mb-10 border border-amber-500/30 bg-black/40 p-8 lg:p-12">
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 border border-amber-500/30 bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
                <Sparkles className="h-4 w-4 text-amber-400" />
                {t("hero.badge")}
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-amber-300 sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>

              <nav
                aria-label="Breadcrumb"
                className="mt-6 text-xs uppercase tracking-widest text-amber-200/70"
              >
                <ol className="flex flex-wrap items-center gap-2 font-medium">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-amber-400"
                    >
                      {t("breadcrumb.home")}
                    </Link>
                  </li>

                  <li className="text-amber-500/50">/</li>

                  <li>
                    <Link
                      href="/servicios"
                      className="transition-colors hover:text-amber-400"
                    >
                      {t("breadcrumb.services")}
                    </Link>
                  </li>

                  <li className="text-amber-500/50">/</li>

                  <li>
                    <Link
                      href="/servicios"
                      className="transition-colors hover:text-amber-400"
                    >
                      {t("breadcrumb.packages")}
                    </Link>
                  </li>

                  <li className="text-amber-500/50">/</li>

                  <li className="font-semibold text-amber-400">
                    {t("breadcrumb.current")}
                  </li>
                </ol>
              </nav>
            </div>
          </section>

          {/* Content Grid */}
          <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Image Card */}
            <div className="border border-amber-500/30 bg-black/40 p-3">
              <div className="relative aspect-square w-full overflow-hidden border border-amber-500/20 bg-zinc-900">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop"
                  alt={t("product.imageAlt")}
                  fill
                  className="object-cover grayscale contrast-125 transition-transform duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                    <Package2 className="h-4 w-4 text-amber-400" />
                    {t("product.name")}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="border border-amber-500/30 bg-black/40 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
                <FileText className="h-4 w-4 text-amber-400" />
                {t("form.badge")}
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-amber-300">
                {t("product.name")}
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-amber-100/80">
                <p className="flex items-start gap-3 font-medium text-amber-200">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  {t("description.contactAdvisor")}
                </p>

                <p>{t("description.instructions")}</p>
              </div>

              {/* Form Fields */}
              <div className="mt-8 space-y-6">
                {/* Folio */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                    <FileText className="h-4 w-4 text-amber-400" />
                    {t("form.folioLabel")}
                  </label>

                  <input
                    type="text"
                    placeholder={t("form.folioPlaceholder")}
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    className="h-12 w-full border border-amber-500/30 bg-zinc-950 px-4 text-amber-100 text-sm font-normal outline-none transition-colors placeholder:text-amber-200/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                    <CreditCard className="h-4 w-4 text-amber-400" />
                    {t("form.amountLabel")}
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-amber-400/60 text-sm">
                      $
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 w-full border border-amber-500/30 bg-zinc-950 pl-9 pr-4 text-amber-100 text-sm font-normal outline-none transition-colors placeholder:text-amber-200/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Total Preview */}
                <div className="border border-amber-500/40 bg-black/60 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                        {t("total.label")}
                      </p>

                      <h3 className="mt-1 text-3xl font-black text-amber-300">
                        ${formattedTotal}
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center border border-amber-500/30 bg-amber-500/10">
                      <ShoppingCart className="h-6 w-6 text-amber-400" />
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!folio.trim() || numericAmount <= 0}
                  className="flex h-12 w-full items-center justify-center border border-amber-400 bg-amber-500 text-zinc-950 text-xs font-extrabold uppercase tracking-widest transition-all hover:bg-amber-400 active:translate-y-0.5 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  <span>{t("form.addToCart")}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}