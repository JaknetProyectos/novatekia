import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CustomPlanBand from "@/components/CustomPlanBand";
import ExtraServices from "@/components/ExtraServices";
import QuoteSection from "@/components/QuoteSection";
import ServicesSection from "@/components/ServicesSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ServiciosPage() {
  const t = await getTranslations("servicesPage");

  return (
    <>
      <section className="bg-[#800020] py-20 px-10 md:py-24">
        <div >
          <h1 className="animate-rise text-[44px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#d4af37] sm:text-[62px]">
            {t("title")}
          </h1>
          <p
            className="animate-rise mt-4 max-w-[560px] text-[17px] leading-relaxed text-[#f3e5ab]"
            style={{ animationDelay: "120ms" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      <ServicesSection withHeading={false} />
      <ExtraServices />
      <CustomPlanBand />
      <QuoteSection />
    </>
  );
}