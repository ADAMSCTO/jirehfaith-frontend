"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

export default function AboutPage() {
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
      <h1 className="text-3xl font-bold mb-4">{t("about.title", lang)}</h1>

      <p>{t("about.p1", lang)}</p>

      <p>{t("about.p2", lang)}</p>

      <h2 className="text-2xl font-semibold mt-6">{t("about.mission.h", lang)}</h2>
      <p>{t("about.mission.p", lang)}</p>

      <h2 className="text-2xl font-semibold mt-6">{t("about.how.h", lang)}</h2>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>{t("about.how.1", lang).split(":")[0]}:</strong>
          <span> {t("about.how.1", lang).split(":").slice(1).join(":").trim()}</span>
        </li>
        <li>
          <strong>{t("about.how.2", lang).split(":")[0]}:</strong>
          <span> {t("about.how.2", lang).split(":").slice(1).join(":").trim()}</span>
        </li>
        <li>
          <strong>{t("about.how.3", lang).split(":")[0]}:</strong>
          <span> {t("about.how.3", lang).split(":").slice(1).join(":").trim()}</span>
        </li>
      </ol>

      <p>{t("about.vision.p", lang)}</p>

      <h2 className="text-2xl font-semibold mt-6">{t("about.unique.h", lang)}</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>{t("about.unique.1", lang)}</li>
        <li>{t("about.unique.2", lang)}</li>
        <li>{t("about.unique.3", lang)}</li>
        <li>{t("about.unique.4", lang)}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">{t("about.vision.h", lang)}</h2>
      <p>{t("about.vision.p", lang)}</p>

      <h2 className="text-2xl font-semibold mt-6">{t("about.ministry.h", lang)}</h2>
      <p>{t("about.ministry.p", lang)}</p>

      <p className="mt-6 font-semibold">{t("about.blessing", lang)}</p>

      <div className="mt-8">
                <a
          id="tech-info-cta"
          href="/tech-info"
          role="link"
          target="_self"
          tabIndex={0}
          onClick={(e) => {
            try {
              e.preventDefault();
              window.location.href = "/tech-info";
            } catch {
              /* no-op fallback */
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              try {
                window.location.href = "/tech-info";
              } catch {}
            }
          }}
          className="inline-block rounded-lg border border-[var(--brand-gold)] px-4 py-2 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-white transition cursor-pointer"
          aria-label={t("about.cta.tech", lang)}
          title={t("about.cta.tech", lang)}
        >
          {t("about.cta.tech", lang)}
        </a>
      </div>

    </main>
  );
}
