"use client";


import { extraServicesEnglish, extraServicesSpanish } from "@/data/services";
import { useLocale } from "next-intl";

export function useExtraServices() {
    const locale = useLocale();
    const extraServices = locale == "es" ? extraServicesSpanish : extraServicesEnglish;

    return { extraServices }
}