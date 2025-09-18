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
    console.log('Current language:', current);  // Log the current language to the console
    setLangState(current);
    const unsub = onLangChange((l) => setLangState(l));
    return () => unsub();
  }, []);

  // Log the result of t() for tech.h and tech.p before returning the JSX
  console.log('Translation for tech.h:', t("tech.h", lang));  // Log translation result for tech.h
  console.log('Translation for tech.p:', t("tech.p", lang));  // Log translation result for tech.p

  return (
    <main className="p-4 max-w-3xl mx-auto prose prose-lg text-white prose-headings:text-[var(--brand-gold)] prose-strong:text-[var(--brand-gold)]">
      <h1 className="text-3xl font-bold mb-4">{safeT("tech.h", lang)}</h1>
      <p>{safeT("tech.p", lang)}</p>

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
