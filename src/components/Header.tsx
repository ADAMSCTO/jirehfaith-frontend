"use client";

import { useEffect, useState } from "react";
import { getLang, setLang, onLangChange, type Lang, preloadCurrentLang, t } from "@/lib/i18n";
import Link from "next/link";

export default function Header() {
  const [lang, setLangState] = useState<Lang>("en");

  // Translate with fallback to keep UI resilient if a key is missing
  const tt = (key: string, fallback: string) => {
    const v = t(key, lang);
    return v === key ? fallback : v;
  };

  // Sync state with persisted language
  useEffect(() => {
    const current = getLang();
    setLangState(current);
    preloadCurrentLang();
    const unsub = onLangChange((l) => {
    preloadCurrentLang();
    setLangState(l);
  });
    return () => {
      try { unsub(); } catch {}
    };
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang;
    setLang(newLang);
    setLangState(newLang);
  };

  return (
    <header className="w-full sticky top-0 z-10 bg-[var(--header)] backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-5xl px-4 py-1 flex flex-col items-center justify-center gap-3">
        {/* Center title / logo block */}
        <Link
          href="/"
          aria-label={tt("nav.home", "Home")}
          title={tt("nav.home", "Home")}
          className="flex flex-col items-center text-center flex-grow leading-tight w-full order-2 md:order-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] cursor-pointer"
        >
          <div className="text-3xl" style={{ color: "var(--brand-gold)" }}>
            🔥
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--brand-gold)" }}>
            {tt("hero.title", "JIREH FAITH")}
          </div>
          <div className="text-base italic" style={{ color: "var(--brand-gold)" }}>
            {tt("hero.tagline", "When life speaks, let God’s Word answer.")}
          </div>
        </Link>

        {/* Nav buttons — centered under logo */}
        <nav className="flex items-center gap-3 text-sm flex-wrap order-3 md:order-none justify-center w-full md:w-auto">
          {/* HOME */}
          <Link
            href="/"
            aria-label={tt("nav.home", "Home")}
            title={tt("nav.home", "Home")}
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            🔥 {tt("nav.home", "Home")}
          </Link>

          {/* DONATE */}
          <Link
            href="/donate"
            aria-label={tt("nav.donate", "Donate")}
            title={tt("nav.donate", "Donate")}
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ❤️ {tt("nav.donate", "Donate")}
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            aria-label={tt("nav.about", "About")}
            title={tt("nav.about", "About")}
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ✝️ {tt("nav.about", "About")}
          </Link>

          {/* Language Selector */}
          <select
            aria-label={tt("lang.selector.label", "Language")}
            id="language-header"
            name="language"
            autoComplete="off"
            value={lang}
            onChange={handleLangChange}
            title={tt("lang.selector.label", "Language")}
            className="ml-2 md:ml-6 px-2 py-1 border rounded-md bg-white text-black shrink-0"
            style={{ borderColor: "var(--brand-gold)" }}
          >
            <option value="en">{tt("lang.en", "English")}</option>
            <option value="es">{tt("lang.es", "Español")}</option>
            <option value="fr">{tt("lang.fr", "Français")}</option>
            <option value="pt">{tt("lang.pt", "Português")}</option>
          </select>
        </nav>
      </div>
    </header>
  );
}
