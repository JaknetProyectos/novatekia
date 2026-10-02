"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/context/cart-context";
import { useExtraServices } from "@/hooks/useExtraServices";
import { formatPrice } from "@/lib/format-price";
import { ShoppingCart, Monitor } from "lucide-react";

function Online() {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-red-950">
      <Monitor size={14} className="text-red-900" />
      <span>Online</span>
    </span>
  );
}

export default function ExtraServices() {
  const t = useTranslations("extraServices");
  const { extraServices } = useExtraServices();
  const { addItem } = useCart();

  const headers = [
    t("table.service"),
    t("table.modality"),
    t("table.duration"),
    t("table.cost"),
    t("table.notes"),
    t("table.buy"),
  ];

  return (
    <section className="bg-amber-500 py-16 md:py-24 border-b border-amber-600/40 text-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Encabezado de sección */}
        <div className="flex flex-col items-start border-l-4 border-red-950 pl-4">
          <h2 className="text-3xl font-black uppercase tracking-tight text-red-950 sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm font-mono tracking-widest uppercase text-red-900 font-bold">
            {t("subtitle")}
          </p>
        </div>

        {/* Tabla — Vista Desktop (lg+) */}
        <div className="mt-12 hidden lg:block border-2 border-red-950 bg-amber-400/40 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-red-950 text-amber-300 border-b-2 border-red-950">
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    className="p-4 text-center text-xs font-mono uppercase tracking-wider font-bold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-red-950/20">
              {extraServices.map((service, i) => (
                <tr
                  key={service.id}
                  className={i % 2 === 0 ? "bg-amber-400/30" : "bg-amber-500"}
                >
                  <td className="p-4 text-center max-w-[240px]">
                    <p className="text-sm font-bold text-red-950 uppercase">
                      {service.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-900 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <Online />
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-mono font-bold text-red-950">
                    {service.duration}
                  </td>
                  <td className="p-4 text-center text-sm font-bold font-mono text-red-950">
                    {formatPrice(service.price)} MXN <span className="text-[11px] block font-normal text-red-900">{t("vat")}</span>
                  </td>
                  <td className="p-4 text-center text-xs italic text-zinc-900 max-w-[200px]">
                    {service.notes}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          id: service.id,
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-red-950 px-4 py-2.5 text-xs font-mono uppercase tracking-widest font-bold text-amber-300 border border-red-900 hover:bg-red-900 hover:text-amber-200 transition-colors"
                    >
                      <ShoppingCart size={14} />
                      <span>{t("buyButton")}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tarjetas — Grid Responsive para Móvil / Tablet (menos de lg) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
          {extraServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between border-2 border-red-950 bg-amber-400/40 p-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2 border-b border-red-950/20 pb-3">
                  <h3 className="text-base font-bold uppercase text-red-950">
                    {service.title}
                  </h3>
                  <Online />
                </div>

                <p className="text-xs text-zinc-900 leading-relaxed font-medium">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-red-950/10 p-3 my-1 border border-red-950/20 text-xs font-mono">
                  <div>
                    <span className="block text-[10px] uppercase text-red-900">{t("mobile.duration")}</span>
                    <span className="font-bold text-red-950">{service.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-red-900">{t("mobile.cost")}</span>
                    <span className="font-bold text-red-950">{formatPrice(service.price)} MXN</span>
                  </div>
                </div>

                {service.notes && (
                  <p className="text-xs italic text-zinc-900">
                    {service.notes}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-red-950/20">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      id: service.id,
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-red-950 px-4 py-3 text-xs font-mono uppercase tracking-widest font-bold text-amber-300 border border-red-900 hover:bg-red-900 transition-colors"
                >
                  <ShoppingCart size={15} />
                  <span>{t("buyNowButton")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}