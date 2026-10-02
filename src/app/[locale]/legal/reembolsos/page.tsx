"use client";

import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalStyle from "@/components/LegalStyle";

function LegalEs() {
  return (
    <div className="legal-container">
      <LegalStyle />


    </div>
  );
}

function LegalEn() {
  return (
    <div className="legal-container">
      <LegalStyle />


    </div>
  );
}

export default function LegalPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#0b1020] flex flex-col">
      <main className="flex-grow container mx-auto px-6 mt-20 py-20 max-w-4xl">
        {locale === "es" ? <LegalEs /> : <LegalEn />}
      </main>
    </div>
  );
}