"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getLang, onLangChange, preloadCurrentLang, type Lang } from "@/lib/i18n";

// Context holds the current language code (e.g., "en" | "es" | "fr" | "pt")
const LanguageContext = createContext<Lang>("en");

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    (async () => {
      try {
        await preloadCurrentLang(); // Preload translation files
      } catch {
        // no-op
      }
      try {
        const current = getLang();
        if (current) setLang(current as Lang);
      } catch {
        // keep default
      }
    })();

    // Keep page state in sync with global i18n selector
    const unsub = onLangChange((newLang) => setLang(newLang as Lang));
    return () => {
      if (typeof unsub === "function") {
        try { unsub(); } catch {}
      }
    };
  }, []);

  return <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>;
};

// Hook to read the current language
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;

