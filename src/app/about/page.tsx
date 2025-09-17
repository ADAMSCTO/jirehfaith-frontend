"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

export default function AboutPage() {
  const [lang, setLangState] = useState<Lang>("en");

  // English-fallback translator: if current locale is missing a key, show EN
  const tt = (key: string) => {
    const v = t(key, lang);
    return v === key ? t(key, "en") : v;
  };

  useEffect(() => {
    const current = getLang();
    setLangState(current);
    preloadCurrentLang();
    const unsub = onLangChange((l) => setLangState(l));
    return () => unsub();
  }, []);

  return (
    <main className="p-4 max-w-3xl mx-auto prose prose-lg text-white prose-headings:text-[var(--brand-gold)] prose-strong:text-[var(--brand-gold)]">
      <h1 className="text-3xl font-bold mb-4">{tt("about.title")}</h1>

      <p>{tt("about.p1")}</p>

      <p>{tt("about.p2")}</p>

      <h2 className="text-2xl font-semibold mt-6">{tt("about.mission.h")}</h2>
      <p>{tt("about.mission.p")}</p>

      <h2 className="text-2xl font-semibold mt-6">{tt("about.how.h")}</h2>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>{tt("about.how.1").split(":")[0]}:</strong>
          <span> {tt("about.how.1").split(":").slice(1).join(":").trim()}</span>
        </li>
        <li>
          <strong>{tt("about.how.2").split(":")[0]}:</strong>
          <span> {tt("about.how.2").split(":").slice(1).join(":").trim()}</span>
        </li>
        <li>
          <strong>{tt("about.how.3").split(":")[0]}:</strong>
          <span> {tt("about.how.3").split(":").slice(1).join(":").trim()}</span>
        </li>
      </ol>

      <p>{tt("about.vision.p")}</p>

      <h2 className="text-2xl font-semibold mt-6">{tt("about.unique.h")}</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>{tt("about.unique.1")}</li>
        <li>{tt("about.unique.2")}</li>
        <li>{tt("about.unique.3")}</li>
        <li>{tt("about.unique.4")}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">{tt("about.vision.h")}</h2>
      <p>{tt("about.vision.p")}</p>

      <h2 className="text-2xl font-semibold mt-6">{tt("about.ministry.h")}</h2>
      <p>{tt("about.ministry.p")}</p>

      <p className="mt-6 font-semibold">{tt("about.blessing")}</p>

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
          aria-label={tt("about.cta.tech")}
          title={tt("about.cta.tech")}
        >
          {tt("about.cta.tech")}
        </a>
      </div>
    </main>
  );
}
