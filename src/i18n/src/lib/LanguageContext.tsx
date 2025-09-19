// src/lib/LanguageContext.tsx

import { createContext, useContext, useState, useEffect } from "react";
import { getLang, onLangChange, preloadCurrentLang } from "@/lib/i18n";

// Create a language context to share language state globally
const LanguageContext = createContext<string>("en");

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    preloadCurrentLang(); // Preload the translation files
    const currentLang = getLang();
    setLang(currentLang);
    const unsub = onLangChange((newLang) => setLang(newLang));
    return () => unsub();
  }, []);

  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to access the current language
export const useLanguage = () => useContext(LanguageContext);
