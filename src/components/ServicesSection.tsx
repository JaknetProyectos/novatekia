"use client";

import { useTranslations } from "next-intl";
import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCourses";

export default function ServicesSection({
  withHeading = true,
}: {
  withHeading?: boolean;
}) {
  const t = useTranslations("servicesSection");
  const { courses } = useCourses();

  return (
    <section id="servicios" className="bg-white py-16 md:py-24 text-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {withHeading && (
          <header className="mb-12 border-b border-amber-500/20 pb-8 flex flex-col items-start gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-red-900 bg-red-950/5 px-2.5 py-1 border border-red-950/10">
              {t("badge")}
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-red-950 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="max-w-2xl text-base text-zinc-700 font-medium">
              {t("description")}
            </p>
          </header>
        )}

        {/* Layout estrictamente en Grid responsive sin elementos flotantes */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}