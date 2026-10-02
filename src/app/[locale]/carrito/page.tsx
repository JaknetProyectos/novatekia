"use client";

import { useCart } from "@/context/cart-context";
import { Link } from "@/i18n/routing";
import { formatPrice } from "@/lib/format-price";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, itemCount } = useCart();
  const t = useTranslations("cartPage");

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-red-950 px-4 py-16 sm:px-6 lg:px-12 flex items-center justify-center border-b border-amber-500/30">
        {/* Carrito Vacío - Card Rectangular Sobria */}
        <div className="w-full max-w-md border border-amber-500/30 bg-black/40 p-8 sm:p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-amber-500/40 bg-red-900/40 text-amber-400">
            <ShoppingBag className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-amber-300 mb-2 uppercase">
            {t("emptyTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-amber-100/80 mb-8">
            {t("emptyDescription")}
          </p>

          <Link
            href="/servicios"
            className="group inline-flex w-full items-center justify-center gap-2 bg-amber-500 py-3.5 px-6 font-semibold uppercase tracking-wider text-zinc-950 border border-amber-400 hover:bg-amber-400 transition-colors"
          >
            <span>{t("exploreServices")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-950 px-4 py-12 sm:px-6 lg:px-12 text-amber-100 border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado del Carrito */}
        <div className="mb-8 border border-amber-500/30 bg-black/40 p-6 sm:p-8 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-amber-500/40 bg-red-900/40 text-amber-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-amber-300">
              {t("title")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium tracking-wider text-amber-200/80">
              {t("itemsSelected", {
                count: itemCount,
                itemLabel: itemCount === 1 ? t("service") : t("services"),
              })}
            </p>
          </div>
        </div>

        {/* Layout Grid Responsivo de 2 Columnas */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* Listado de Servicios (2 Col en Desktop) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-amber-500/30 bg-black/40 p-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-center hover:border-amber-400/60 transition-colors"
              >
                {/* Detalles del Producto */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-amber-300 uppercase tracking-wide">
                    {item.product?.title ?? t("defaultServiceTitle")}
                  </h3>

                  {item.product?.description && (
                    <p className="text-sm text-amber-100/70 leading-relaxed max-w-xl">
                      {item.product?.description}
                    </p>
                  )}
                </div>

                {/* Área de Controles Derechos */}
                <div className="flex items-center justify-between gap-6 border-t border-amber-500/20 pt-4 sm:w-auto sm:border-t-0 sm:pt-0 shrink-0">
                  
                  {/* Selector de Cantidad */}
                  <div className="flex items-center border border-amber-500/30 bg-black/50 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center border border-amber-500/20 bg-red-900/40 text-amber-300 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                      aria-label={t("decreaseQuantity")}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    
                    <span className="w-10 text-center text-sm font-bold text-amber-300">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center border border-amber-500/20 bg-red-900/40 text-amber-300 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                      aria-label={t("increaseQuantity")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="min-w-[110px] text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-400/60">
                      {t("subtotal")}
                    </span>
                    <span className="text-base font-bold text-amber-300">
                      MXN {formatPrice(item.subtotal)}
                    </span>
                  </div>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-9 w-9 items-center justify-center border border-amber-500/30 bg-black/40 text-amber-400/70 hover:border-red-500 hover:bg-red-900 hover:text-amber-200 transition-colors"
                    title={t("removeService")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del Pedido (Sidebar) */}
          <div className="border border-amber-500/30 bg-black/40 p-6 sm:p-8 flex flex-col gap-6">
            <h2 className="border-b border-amber-500/20 pb-4 text-lg font-bold uppercase tracking-wider text-amber-300">
              {t("summaryTitle")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-amber-100/80">
                <span>{t("subtotal")}</span>
                <span className="font-bold text-amber-300">
                  MXN {formatPrice(total)}
                </span>
              </div>
              <div className="flex justify-between text-amber-100/80">
                <span>{t("taxesFees")}</span>
                <span className="text-xs text-amber-400/60">
                  {t("calculatedAtCheckout")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-amber-500/20 pt-4">
              <span className="text-sm font-bold uppercase tracking-wider text-amber-100">
                {t("estimatedTotal")}
              </span>
              <span className="text-xl font-extrabold text-amber-400">
                MXN {formatPrice(total)}
              </span>
            </div>

            {/* CTA Proceder al Checkout */}
            <Link
              href="/checkout"
              className="group flex w-full items-center justify-center gap-2 bg-amber-500 py-4 font-bold text-xs uppercase tracking-widest text-zinc-950 border border-amber-400 hover:bg-amber-400 transition-colors"
            >
              <span>{t("proceedToCheckout")}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-center text-xs text-amber-200/70">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{t("securityNotice")}</span>
            </div>

            {/* Badges de Pago Seguro */}
            <div className="flex items-center justify-center gap-6 border border-amber-500/20 bg-black/30 p-4">
              <Image
                src="/keycop.webp"
                alt="keycop"
                width={110}
                height={28}
                className="object-contain invert brightness-0"
              />
              <Image
                src="/secure-payment.png"
                alt="secure"
                width={130}
                height={20}
                className="object-contain invert brightness-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}