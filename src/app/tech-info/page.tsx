"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

// Manually import translation files to ensure they are loaded
import en from '@/i18n/en.json';
import es from '@/i18n/es.json';

const safeT = (key: string, lang: Lang | undefined) => {
  const translation = t(key, lang || "en");
  if (translation === key) {
    console.warn(`Missing translation for: ${key}`);
    return `Missing translation for ${key}`;
  }
  return translation;
};

export default function TechInfoPage() {
  // Hardcode lang for testing purposes (force it to "en")
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    preloadCurrentLang(); // Load current language first
    const current = getLang();
    console.log('Current language:', current);  // Log the current language
    setLangState(current);  // Set lang state to current language
    const unsub = onLangChange((l) => setLangState(l));  // Listen for language changes
    return () => unsub();  // Cleanup on unmount
  }, []);

  // Log translation output directly for tech.h and tech.p
  console.log('Current lang value:', lang);
  console.log('Translation for tech.h:', t("tech.h", lang));  // Check tech.h translation
  console.log('Translation for tech.p:', t("tech.p", lang));  // Check tech.p translation

  return (
    <main className="p-4 max-w-3xl mx-auto prose prose-lg text-white prose-headings:text-[var(--brand-gold)] prose-strong:text-[var(--brand-gold)]">
      <h1 className="text-3xl font-bold mb-4">{t("tech.h", lang)}</h1>
      <p>{t("tech.p", lang)}</p>

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
