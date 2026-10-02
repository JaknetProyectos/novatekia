'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useTransition
} from 'react';

import { useLocale } from 'next-intl';


import { usePathname, useRouter } from '@/i18n/routing';

type LocaleContextType = {
    locale: string;
    switchLanguage: (nextLocale: string) => void;
    isPending: boolean;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

const STORAGE_KEY = 'app-locale';
const CHANNEL_NAME = 'locale-sync';

export function LocaleProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [currentLocale, setCurrentLocale] = useState(locale);

    /**
     * Mantiene sync local state
     */
    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    /**
     * Escucha cambios entre pestañas
     */
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_NAME);

        channel.onmessage = (event) => {
            const nextLocale = event.data;

            if (!nextLocale || nextLocale === currentLocale) return;

            setCurrentLocale(nextLocale);

            startTransition(() => {
                router.replace(pathname, {
                    locale: nextLocale
                });
            });
        };

        return () => {
            channel.close();
        };
    }, [currentLocale, pathname, router]);

    /**
     * Sync por localStorage (fallback)
     */
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY) return;

            const nextLocale = event.newValue;

            if (!nextLocale || nextLocale === currentLocale) return;

            setCurrentLocale(nextLocale);

            startTransition(() => {
                router.replace(pathname, {
                    locale: nextLocale
                });
            });
        };

        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, [currentLocale, pathname, router]);

    const switchLanguage = useCallback(
        (nextLocale: string) => {
            if (nextLocale === currentLocale) return;

            setCurrentLocale(nextLocale);

            /**
             * Guarda preferencia
             */
            localStorage.setItem(STORAGE_KEY, nextLocale);

            /**
             * Sync entre pestañas
             */
            const channel = new BroadcastChannel(CHANNEL_NAME);
            channel.postMessage(nextLocale);
            channel.close();

            /**
             * Cookie para middleware next-intl
             */
            document.cookie = `NEXT_LOCALE=${nextLocale}; path=/`;

            startTransition(() => {
                router.replace(pathname, {
                    locale: nextLocale
                });
            });
        },
        [currentLocale, pathname, router]
    );

    const value = useMemo(
        () => ({
            locale: currentLocale,
            switchLanguage,
            isPending
        }),
        [currentLocale, switchLanguage, isPending]
    );

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocaleContext() {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error(
            'useLocaleContext must be used inside LocaleProvider'
        );
    }

    return context;
}


/**
 * En [locale]/layout.tsx 
 * <LocaleProvider>
 *  ..... resto de context
 * </LocaleProvider>
 * 
 * Luego en el header o donde venga el lang switcher
 * const { locale, switchLanguage, isPending } = useLocaleContext();
 * 
 * onclick =  switchLanguage(language.code)
 */