import BenefitsSection from "@/components/BenefitsSection";
import CustomPlanBand from "@/components/CustomPlanBand";
import ExtraServices from "@/components/ExtraServices";
import FeaturesSection from "@/components/FeaturesSection";
import Hero from "@/components/Hero";
import QuoteSection from "@/components/QuoteSection";
import ServicesSection from "@/components/ServicesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <BenefitsSection />
      <ServicesSection />
      <ExtraServices />
      <CustomPlanBand />
      <QuoteSection />
    </>
  );
}
