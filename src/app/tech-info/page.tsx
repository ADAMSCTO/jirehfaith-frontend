"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

// Safe translation helper with enhanced fallback and debug logging
const safeT = (key: string, lang: Lang | undefined) => {
  const translation = t(key, lang || "en");
  if (translation === key) {
    console.warn(`Missing translation for: ${key}`);  // Log to help identify missing translations
    return `Missing translation for ${key}`;  // Clear fallback message
  }
  return translation;
};

export default function TechInfoPage() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    preloadCurrentLang(); // Move preloadCurrentLang first
    const current = getLang();
    console.log('Current language:', current);  // Log the current language
    setLangState(current);
    const unsub = onLangChange((l) => setLangState(l));
    return () => unsub();
  }, []);

  // Log translation output directly for tech.h and tech.p before rendering
  console.log('Current lang value:', lang);
  console.log('Translation for tech.h:', t("tech.h", lang));  // Check tech.h translation
  console.log('Translation for tech.p:', t("tech.p", lang));  // Check tech.p translation

  return (
    <main className="p-4 max-w-3xl mx-auto prose prose-lg text-white prose-headings:text-[var(--brand-gold)] prose-strong:text-[var(--brand-gold)]">
      {/* Translated "Tech Info" header */}
      <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--brand-gold)" }}>
        {t("tech.h", lang)}  {/* Dynamically load the translation for "Tech Info" */}
      </h1>
      <p>{t("tech.p", lang)}</p>  {/* Dynamically load the translation for the paragraph */}

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        Response Metrics
      </h2>
      <p>
        The application tracks how long each prayer composition request takes to
        process. Last response time and timestamp are stored locally in your
        browser.
      </p>

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        System Info
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Framework:</strong> Next.js (App Router)
        </li>
        <li>
          <strong>Styling:</strong> Tailwind CSS + custom brand variables
        </li>
        <li>
          <strong>State Management:</strong> React hooks with TanStack Query
        </li>
        <li>
          <strong>Backend:</strong> DHLL API for context-aware prayer composition
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        Diagnostics
      </h2>
      <p>
        Future versions may display request/response logs and technical debugging
        panels here instead of the main prayer page.
      </p>
    </main>
  );
}
