"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

// Embedded English fallback so About never shows raw keys, even if i18n loader fails
const EN_ABOUT = {
  title: "About JirehFaith",
  p1: "At Jireh Faith, we believe that when life speaks — in joy, in sorrow, in fear, or in gratitude — the most powerful response comes from God’s Word.",
  p2: "Rooted in the promise of Jehovah Jireh — “The Lord will provide” (Genesis 22:14) — JirehFaith is a prayer companion designed to bring Scripture into your everyday circumstances.",
  mission: {
    h: "Our Mission",
    p: "To provide personalized, Scripture-based prayers that meet people where they are, offering comfort, encouragement, and hope — pointing back to God’s faithfulness.",
  },
  how: {
    h: "How It Works",
    "1": "Share Your Need: Select or describe your circumstance.",
    "2": "Scripture Speaks: JirehFaith finds Bible passages reflecting your situation.",
    "3": "Prayer is Formed: A heartfelt prayer is generated, rooted in the Word.",
  },
  unique: {
    h: "What Makes JirehFaith Unique",
    "1": "Scripture First — every prayer anchored in the Bible.",
    "2": "Emotionally Attuned — powered by DHLL for human sensitivity.",
    "3": "Multi-Language — English, French, Spanish, Portuguese.",
    "4": "Accessible for All — free daily prayers; subscriptions and donations sustain the mission.",
  },
  vision: {
    h: "Our Vision",
    p: "We envision a world where no believer prays alone.",
  },
  ministry: {
    h: "Our Ministry",
    p: "Please support our ministry through Donation or Subscription. Share the Scriptures with others!",
  },
  blessing: "God’s Blessings be upon you always!",
  cta: {
    tech: "Tech Info",
    donate: "Donate",
  },
} as const;

// Minimal resolver for keys like "about.mission.h"
function fromEnAbout(path: string): string {
  if (!path.startsWith("about.")) return "";
  const parts = path.replace(/^about\./, "").split(".");
  let cur: any = EN_ABOUT;
  for (const p of parts) {
    cur = cur?.[p];
    if (cur == null) return "";
  }
  return String(cur ?? "");
}

export default function AboutPage() {
  const [lang, setLangState] = useState<Lang>("en");

  // Fallback translator: try active locale; if it returns the key, use embedded EN
  const tt = (key: string) => {
    const v = t(key, lang);
    return v !== key ? v : fromEnAbout(key) || key;
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
      <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--brand-gold)" }}>
        {tt("about.title")}
      </h1>

      <p>{tt("about.p1")}</p>
      <p>{tt("about.p2")}</p>

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {tt("about.mission.h")}
      </h2>
      <p>{tt("about.mission.p")}</p>

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {tt("about.how.h")}
      </h2>
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

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {tt("about.unique.h")}
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>{tt("about.unique.1")}</li>
        <li>{tt("about.unique.2")}</li>
        <li>{tt("about.unique.3")}</li>
        <li>{tt("about.unique.4")}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {tt("about.vision.h")}
      </h2>
      <p>{tt("about.vision.p")}</p>

      <h2 className="text-2xl font-semibold mt-6" style={{ color: "var(--brand-gold)" }}>
        {tt("about.ministry.h")}
      </h2>
      <p>{tt("about.ministry.p")}</p>

      <p className="mt-6 font-semibold">{tt("about.blessing")}</p>

      <div className="mt-8">
        <a
          id="tech-info-cta"
          href="/tech-info/index.html"
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
