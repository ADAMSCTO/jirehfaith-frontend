"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getLang, onLangChange, preloadCurrentLang, type Lang } from "@/lib/i18n";

// Create a language context to share language state globally
const LanguageContext = createContext<Lang>("en");

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const loadLang = async () => {
      try {
        await preloadCurrentLang(); // Preload translation files
        const current = getLang();
        setLang(current as Lang);
      } catch (err) {
        console.error("Failed to preload language:", err);
      }
    };

    loadLang();

    const unsub = onLangChange((newLang) => setLang(newLang as Lang));
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to access the current language
export const useLanguage = () => useContext(LanguageContext);
