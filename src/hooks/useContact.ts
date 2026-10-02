"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

/**
 * Campos base recomendados
 * pero permitiendo cualquier otro campo dinámico
 */
export interface ContactData {
  nombre?: string;
  email?: string;
  mensaje?: string;

  // Campos opcionales comunes
  telefono?: string;
  asunto?: string;
  servicioDeseado?: string;
  presupuesto?: string;
  tienda?: string;
  sitio?: string;

  // Campos dinámicos universales
  [key: string]: string | number | boolean | null | undefined;
}

interface SendContactOptions {
  endpoint?: string;
}

export function useContact(options?: SendContactOptions) {
  const [isLoading, setIsLoading] = useState(false);

  const locale = useLocale();

  const sendContactForm = async (data: ContactData) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        options?.endpoint || `/${locale ?? "es"}/api/contacto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...data,locale}),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje");
      }

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendContactForm,
    isLoading,
  };
}