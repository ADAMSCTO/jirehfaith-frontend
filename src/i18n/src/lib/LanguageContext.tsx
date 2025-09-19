"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import Next.js useRouter hook
import { getLang, onLangChange, preloadCurrentLang, type Lang } from "@/lib/i18n";

// Create a language context to share language state globally
const LanguageContext = createContext<string>("en");

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<string>("en");
  const router = useRouter(); // Get router instance

  // Force translation reload when language changes or page is navigated
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        await preloadCurrentLang(); // Preload the translation files
        const currentLang = getLang();
        setLang(currentLang); // Set the current language state
      } catch (error) {
        console.error("Error preloading translations", error);
      }
    };

    loadTranslations();

    const unsub = onLangChange((newLang) => {
      setLang(newLang);
      loadTranslations();  // Reload translations when language changes
    });

    // Listen for route changes to reload translations when navigating
    const handleRouteChange = () => {
      loadTranslations(); // Reload translations when a route changes
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // Cleanup event listeners on unmount
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      unsub(); // Cleanup language change listener
    };
  }, [router.events]); // Ensure effect runs on route changes

  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to access the current language
export const useLanguage = () => useContext(LanguageContext);
