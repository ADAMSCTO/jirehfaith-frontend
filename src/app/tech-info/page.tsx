// src/app/tech-info/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

// Safe translation helper with enhanced fallback + debug logging
const safeT = (key: string, lang: Lang | undefined) => {
  const translation = t(key, lang || "en");
  if (translation === key) {
    console.warn(`Missing translation for: ${key}`);
    return `Missing translation for ${key}`; // Fallback message
  }
  return translation;
};

// Optional static build info (Next.js inlines NEXT_PUBLIC_* at build time)
const BUILD_INFO = {
  version: process.env.NEXT_PUBLIC_APP_VERSION || "",
  commit: process.env.NEXT_PUBLIC_GIT_COMMIT || "",
  date: process.env.NEXT_PUBLIC_BUILD_DATE || "",
  repo: process.env.NEXT_PUBLIC_REPO_URL || "",
};

export default function TechInfoPage() {
  const [lang, setLangState] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try { await preloadCurrentLang(); } catch {}
      const current = getLang();
      setLangState(current);
      setLoading(false);
    };

    loadTranslations();
    const unsub = onLangChange((l) => setLangState(l));
    return () => { try { unsub(); } catch {} };
  }, []);

  if (loading) {
    // Avoid visual flash; let content render when ready
    return null;
  }

  const hasBuildInfo =
    BUILD_INFO.version || BUILD_INFO.commit || BUILD_INFO.date || BUILD_INFO.repo;

  return (
    <main
      className="p-4 max-w-3xl mx-auto prose prose-lg text-white
                 prose-headings:text-[var(--brand-gold)] prose-strong:text-[var(--brand-gold)]"
      aria-labelledby="tech-title"
    >
      {/* Title */}
      <h1 id="tech-title" className="text-3xl font-bold mb-4" style={{ color: "var(--brand-gold)" }}>
        {safeT("tech.h", lang)}
      </h1>

      {/* Intro */}
      <p>{safeT("tech.p", lang)}</p>

      {/* Response Metrics */}
      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {safeT("tech.metrics.h", lang)}
      </h2>
      <p>{safeT("tech.metrics.p", lang)}</p>

      {/* System Info */}
      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {safeT("tech.system.h", lang)}
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>{safeT("tech.system.items.framework", lang)}</li>
        <li>{safeT("tech.system.items.styling", lang)}</li>
        <li>{safeT("tech.system.items.state", lang)}</li>
        <li>{safeT("tech.system.items.backend", lang)}</li>
      </ul>

      {/* Diagnostics */}
      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {safeT("tech.diagnostics.h", lang)}
      </h2>
      <p>{safeT("tech.diagnostics.p", lang)}</p>

      {/* Optional Build Info (static-export friendly) */}
      {hasBuildInfo ? (
        <>
          <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
            {safeT("tech.build.h", lang)}
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            {BUILD_INFO.version ? (
              <li>
                <strong>{safeT("tech.build.version_label", lang)}</strong>{" "}
                <span>{BUILD_INFO.version}</span>
              </li>
            ) : null}
            {BUILD_INFO.commit ? (
              <li>
                <strong>{safeT("tech.build.commit_label", lang)}</strong>{" "}
                <code className="break-all">{BUILD_INFO.commit}</code>
              </li>
            ) : null}
            {BUILD_INFO.date ? (
              <li>
                <strong>{safeT("tech.build.date_label", lang)}</strong>{" "}
                <span>{BUILD_INFO.date}</span>
              </li>
            ) : null}
            {BUILD_INFO.repo ? (
              <li>
                <a
                  href={BUILD_INFO.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:no-underline
                             focus:outline focus:outline-2 focus:outline-offset-2
                             focus:outline-[var(--brand-gold)]"
                  aria-label={safeT("tech.build.repo_aria", lang)}
                  title={safeT("tech.build.repo_title", lang)}
                >
                  {safeT("tech.build.repo_text", lang)}
                </a>
              </li>
            ) : null}
          </ul>
        </>
      ) : null}
    </main>
  );
}
