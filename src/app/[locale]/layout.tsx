import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import React from 'react';
import ClientBody from './ClientBody';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LocaleProvider } from '@/context/lang-context';
import { CartProvider } from '@/context/cart-context';


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // ESPERAR PARAMS (Next.js 15 Sync Dynamic APIs Fix)
  const { locale } = await params;

  // Validar que el idioma existe en nuestra config
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Carga de mensajes
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ClientBody>
        <LocaleProvider>
          <CartProvider>

            <Header />
            <main >
              {children}
            </main>
            
            <Footer />
            <Toaster />
          </CartProvider>
        </LocaleProvider>
      </ClientBody>
    </NextIntlClientProvider>
  );
}