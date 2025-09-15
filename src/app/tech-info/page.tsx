"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

export default function TechInfoPage() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const current = getLang();
    setLangState(current);
    preloadCurrentLang();
    const unsub = onLangChange((l) => setLangState(l));
    return () => unsub();
  }, []);

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
