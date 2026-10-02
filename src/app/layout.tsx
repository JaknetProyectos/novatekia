import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./[locale]/ClientBody";

// Configuración de las fuentes de Google
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Novatekia — Capacitación en línea",
  description:
    "Programas de capacitación en negocios y recursos humanos. Cursos 100% en línea con enfoque empresarial y humano.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <head>
        {/* Aquí puedes añadir etiquetas adicionales si las necesitas */}
      </head>
      <body
        suppressHydrationWarning
        className="antialiased font-body "
      >
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}