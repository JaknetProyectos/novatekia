"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useContact, ContactData } from "@/hooks/useContact";

export default function ContactSection() {
  const t = useTranslations("contactSection");
  const { sendContactForm, isLoading } = useContact();

  const [formData, setFormData] = useState<ContactData>({
    nombre: "",
    empresa: "",
    email: "",
    mensaje: "",
    plazo: "",
    presupuesto: "",
  });

  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, message: "" });

    const response = await sendContactForm(formData);

    if (response.success) {
      setFeedback({
        type: "success",
        message: t("feedback.success"),
      });
      // Limpiar formulario tras envío exitoso
      setFormData({
        nombre: "",
        empresa: "",
        email: "",
        mensaje: "",
        plazo: "",
        presupuesto: "",
      });
    } else {
      setFeedback({
        type: "error",
        message: response.error || t("feedback.error"),
      });
    }
  };

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-screen py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans">
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#800020]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO TITLE */}
        <header className="border-b border-amber-500/20 pb-12 mb-16">
          <p className="text-amber-500 font-medium tracking-[0.2em] text-xs uppercase mb-3">
            {t("hero.badge")}
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-zinc-100 uppercase">
            {t("hero.titleLine1")} <br className="hidden sm:inline" />
            <span className="font-semibold text-amber-500">{t("hero.titleLine2")}</span>
          </h1>
        </header>

        {/* CONTENIDO PRINCIPAL: 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* COLUMNA IZQUIERDA: INFORMACIÓN DE CONTACTO */}
          <div className="lg:col-span-5 space-y-12 backdrop-blur-md bg-zinc-900/40 p-8 lg:p-10 border border-zinc-800">
            <div>
              <div className="flex items-center space-x-3 mb-4 text-amber-500">
                <MapPin className="w-5 h-5 shrink-0" />
                <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-amber-500">
                  {t("info.addressLabel")}
                </h2>
              </div>
              <address className="not-italic text-sm text-zinc-300 leading-relaxed uppercase tracking-wider pl-8 border-l border-zinc-800">
                Avenida Presidente Masaryk, N° 178, Dep. 303,<br />
                Colonia Polanco V Sección,<br />
                Alcaldía Miguel Hidalgo,<br />
                C.P. 11560,<br />
                Entidad Federativa Ciudad de México.
              </address>
            </div>

            <div className="pt-6 border-t border-zinc-800/60">
              <div className="flex items-center space-x-3 mb-3 text-amber-500">
                <Mail className="w-5 h-5 shrink-0" />
                <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-amber-500">
                  {t("info.emailLabel")}
                </h2>
              </div>
              <a
                href="mailto:atencion@novatekia.com.mx"
                className="text-sm text-zinc-300 hover:text-amber-400 transition-colors pl-8 block tracking-wide font-mono"
              >
                atencion@novatekia.com.mx
              </a>
            </div>

            <div className="pt-6 border-t border-zinc-800/60">
              <div className="flex items-center space-x-3 mb-3 text-amber-500">
                <Phone className="w-5 h-5 shrink-0" />
                <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-amber-500">
                  {t("info.phoneLabel")}
                </h2>
              </div>
              <a
                href="tel:+5215517418261"
                className="text-sm text-zinc-300 hover:text-amber-400 transition-colors pl-8 block tracking-wide font-mono"
              >
                +52 1 55 1741 8261
              </a>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="lg:col-span-7 backdrop-blur-md bg-zinc-900/30 p-8 sm:p-12 border border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Nombre */}
                <div className="space-y-2">
                  <label
                    htmlFor="nombre"
                    className="block text-xs uppercase tracking-wider font-medium text-zinc-400"
                  >
                    {t("form.name.label")} <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={String(formData.nombre ?? "")}
                    onChange={handleChange}
                    placeholder={t("form.name.placeholder")}
                    className="w-full bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Empresa */}
                <div className="space-y-2">
                  <label
                    htmlFor="empresa"
                    className="block text-xs uppercase tracking-wider font-medium text-zinc-400"
                  >
                    {t("form.company.label")}
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={String(formData.empresa ?? "")}
                    onChange={handleChange}
                    placeholder={t("form.company.placeholder")}
                    className="w-full bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider font-medium text-zinc-400"
                >
                  {t("form.email.label")} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={String(formData.email ?? "")}
                  onChange={handleChange}
                  placeholder={t("form.email.placeholder")}
                  className="w-full bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Objetivos del proyecto (Mensaje) */}
              <div className="space-y-2">
                <label
                  htmlFor="mensaje"
                  className="block text-xs uppercase tracking-wider font-medium text-zinc-400"
                >
                  {t("form.message.label")}
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  value={String(formData.mensaje ?? "")}
                  onChange={handleChange}
                  placeholder={t("form.message.placeholder")}
                  className="w-full bg-zinc-950/80 border border-zinc-800 p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Plazo */}
                <div className="space-y-2">
                  <label
                    htmlFor="plazo"
                    className="block text-xs uppercase tracking-wider font-medium text-zinc-400"
                  >
                    {t("form.timeline.label")}
                  </label>
                  <input
                    type="text"
                    id="plazo"
                    name="plazo"
                    value={String(formData.plazo ?? "")}
                    onChange={handleChange}
                    placeholder={t("form.timeline.placeholder")}
                    className="w-full bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Presupuesto */}
                <div className="space-y-2">
                  <label
                    htmlFor="presupuesto"
                    className="block text-xs uppercase tracking-wider font-medium text-zinc-400"
                  >
                    {t("form.budget.label")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">
                      $
                    </span>
                    <input
                      type="text"
                      id="presupuesto"
                      name="presupuesto"
                      value={String(formData.presupuesto ?? "")}
                      onChange={handleChange}
                      placeholder={t("form.budget.placeholder")}
                      className="w-full bg-zinc-950/80 border border-zinc-800 pl-8 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* FEEDBACK NOTIFICATION */}
              {feedback.type && (
                <div
                  className={`p-4 border flex items-center space-x-3 text-sm ${feedback.type === "success"
                      ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
                      : "bg-red-950/40 border-red-800/80 text-red-300"
                    }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-[#800020] hover:bg-[#600018] active:bg-[#400010] text-amber-400 border border-amber-500/30 px-10 py-4 font-medium text-xs uppercase tracking-[0.2em] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span>{isLoading ? t("form.submit.loading") : t("form.submit.default")}</span>
                  <Send className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}