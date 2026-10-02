"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Course } from "@/types/Product";
import { useCart } from "@/context/cart-context";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="border-b border-[#800020]/20 py-3 text-[13px] leading-[1.6] text-[#500014]">
      <span className="font-extrabold">{label}:</span>{" "}
      <span className="uppercase">{value}</span>
    </li>
  );
}

export default function CourseCard({ course }: { course: Course }) {
  const t = useTranslations("courseCard");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  return (
    <article className="flex h-full flex-col border border-[#800020]/30 bg-[#fef3c7] p-7 transition-shadow duration-300 hover:shadow-[10px_10px_0_0_#800020] sm:p-9">
      <p className="text-[11px] uppercase tracking-[0.06em] text-[#800020]/80 font-bold">
        {course.title}
      </p>

      <p className="mt-4 flex items-end gap-1">
        <span className="relative -top-4 text-[20px] font-extrabold text-[#800020]">
          $
        </span>
        <span className="text-[52px] font-extrabold leading-[0.85] tracking-[-0.045em] text-[#800020]">
          {course.price.toLocaleString("en-US")}
        </span>
        <span className="pb-1 text-[13px] font-medium text-[#500014]">
          MXN&nbsp;/&nbsp;{t("priceSuffix")}
        </span>
      </p>

      <p className="mt-4 text-[12px] leading-[1.7] text-[#500014]">
        <span className="italic font-semibold">{t("idealFor")}:</span> {course.description}
      </p>

      <div className="mt-6 h-px w-full bg-[#800020]/20" />

      <ul className="mt-6">
        <Row label={t("includes")} value={course.notes} />
        <Row label={t("modality")} value={course.modality} />
        <Row label={t("duration")} value={course.duration} />
      </ul>

      <div className="flex items-center gap-4 py-4">
        <span className="text-[13px] uppercase tracking-tight text-[#500014] font-semibold">
          {t("attendees")}:
        </span>
        <div className="flex items-center gap-3 border-b border-[#800020]/40 pb-1">
          <button
            type="button"
            aria-label={t("removeAttendee")}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="text-[16px] font-bold text-[#800020] transition-colors hover:text-[#500014]"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-10 bg-transparent text-center text-[14px] font-bold text-[#800020] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label={t("addAttendee")}
            onClick={() => setQty((q) => q + 1)}
            className="text-[16px] font-bold text-[#800020] transition-colors hover:text-[#500014]"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto w-full bg-[#800020] py-4 text-[13px] font-bold uppercase tracking-wider text-[#fef3c7] transition-colors duration-200 hover:bg-[#500014]"
        onClick={() => {
          addItem({
            id: course.id,
            quantity: qty,
          });
        }}
      >
        {t("buyNow")}
      </button>
    </article>
  );
}