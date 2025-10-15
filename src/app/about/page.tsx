"use client";

import { useEffect, useState } from "react";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

// Embedded English fallback so About never shows raw keys, even if i18n loader fails
const EN_ABOUT = {
  title: "About JirehFaith",
  p1: "When life speaks—in joy, sorrow, fear, or gratitude—the most faithful answer is found in God’s Word. JirehFaith is a prayer companion that brings Scripture into everyday circumstances.",
  p2: "Rooted in the promise of Jehovah Jireh—“The Lord will provide” (Genesis 22:14)—JirehFaith helps believers respond to real situations with Scripture-woven prayers that draw us back to God’s presence and provision.",
  mission: {
    h: "Our Mission",
    p: "To provide personalized, Scripture-woven prayers that meet people where they are—offering comfort, encouragement, and hope—while pointing back to God’s unfailing faithfulness.",
  },
  how: {
    h: "How It Works",
    "1": "Share Your Need: Select your circumstance (emotion).",
    "2": "Personalize: Pause at “state your condition” and speak directly to God about what you’re facing.",
    "3": "Scripture Speaks: JirehFaith finds Bible passages that speak into your situation."
  },
  unique: {
    h: "What Makes JirehFaith Unique",
    "1": "Scripture First — Every prayer is anchored in the Bible.",
    "2": "Emotionally Attuned — Powered by the Default Human Logic Layer (DHLL) to reflect real human experiences with sensitivity.",
    "3": "Multilingual — Available in English, Spanish, French, and Portuguese.",
    "4": "Accessible for All — Free daily prayers; subscriptions and donations help sustain the mission.",
  },
  vision: {
    h: "Our Vision",
    p: "No believer prays alone. With JirehFaith, every Christian carries a living reminder of God’s faithfulness, presence, and provision in every season.",
  },
  ministry: {
    h: "Our Ministry",
    p: "Support the work through Donations or Subscriptions—and share these Scriptures with others. God’s blessings be upon you always!",
  },
  blessing: "God’s blessings be upon you always!",
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
          className="inline-block rounded-lg border border-[var(--brand-gold)] px-4 py-2 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-white transition cursor-pointer focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--brand-gold)]"
          aria-label={tt("about.cta.tech")}
          title={tt("about.cta.tech")}
        >
          {tt("about.cta.tech")}
        </a>
      </div>
    </main>
  );
}
