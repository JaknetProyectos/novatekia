"use client";

import { coursesEnglish, coursesSpanish } from "@/data/courses";
import { useLocale } from "next-intl";

export function useCourses() {
    const locale = useLocale();
    const courses = locale == "es" ? coursesSpanish : coursesEnglish;

    return { courses }
}