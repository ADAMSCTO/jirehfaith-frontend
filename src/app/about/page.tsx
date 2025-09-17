"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";
// Hard fallback: import English dictionary so About never shows raw keys
import en from "@/i18n/en.json";

// Resolve dot-path keys like "about.mission.h" from a JSON object
function fromDict(obj: any, path: string): string {
  try {
    return String(path.split(".").reduce((o: any, k: string) => (o ? o[k] : undefined), obj) ?? "");
  } catch {
    return "";
  }
}

export default function AboutPage() {
  const [lang, setLangState] = useState<Lang>("en");

  // English-fallback translator: try current language via t(); if it returns the key,
  // fall back to the value from en.json (guaranteed).
  const tt = (key: string) => {
    const v = t(key, lang);
    if (v !== key) return v;
    const enVal = fromDict(en as any, key);
    return enVal || key; // last resort: show key (shouldn’t happen with en present)
  };

  useEffect(() => {
    const current = getLang();
    setLangState(current);
    try { preloadCurrentLang(); } catch {}
    const unsub = onLangChange((l) => setLangState(l));
    return () => { try { unsub(); } catch {} };
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
            } catch {}
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              try { window.location.href = "/tech-info"; } catch {}
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
