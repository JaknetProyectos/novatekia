"use client";


import { useLocale } from "next-intl";
import { coursesEnglish, coursesSpanish } from "@/data/courses";
import { extraServicesEnglish, extraServicesSpanish } from "@/data/services";
import { Course } from "@/types/Product";

export function useProducts() {
    const locale = useLocale();
    const extraServices = locale == "es" ? extraServicesSpanish : extraServicesEnglish;
    const courses = locale == "es" ? coursesSpanish : coursesEnglish;

    const products: Course[] = []

    for (const service of extraServices) {
        products.push({
            id: service.id,
            title: service.title,
            price: service.price,
            description: service.description,
            duration: service.duration,
            modality: service.modality,
            notes: service.notes
        })
    }

    for (const pack of courses) {
        products.push({
            id: pack.id,
            title: pack.title,
            price: pack.price,
            description: pack.description,
            duration: pack.duration,
            modality: pack.modality,
            notes: pack.notes
        })
    }

    return { products };
}