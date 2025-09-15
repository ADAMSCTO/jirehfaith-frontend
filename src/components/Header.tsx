"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLang, setLang, onLangChange, type Lang, preloadCurrentLang, t } from "@/lib/i18n";

export default function Header() {
  const [lang, setLangState] = useState<Lang>("en");

  // Sync state with persisted language
  useEffect(() => {
    const current = getLang();
    setLangState(current);
    preloadCurrentLang();
    const unsub = onLangChange((l) => setLangState(l));
    return () => unsub();
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang;
    setLang(newLang);
    setLangState(newLang);
  };

  return (
    <header className="w-full sticky top-0 z-10 bg-[var(--header)] backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-5xl px-4 py-1 flex items-center justify-between flex-wrap gap-2">
        {/* Center title / logo block */}
        <Link
          href="/"
          aria-label="Go to Home"
          title="Home"
          className="flex flex-col items-center text-center flex-grow leading-tight w-full order-2 md:order-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] cursor-pointer"
        >
          <div className="text-3xl" style={{ color: "var(--brand-gold)" }}>
            🔥
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--brand-gold)" }}>
            {t("site.name", lang)}
          </div>
          <div className="text-base italic" style={{ color: "var(--brand-gold)" }}>
            {t("hero.tagline", lang)}
          </div>
        </Link>

        {/* Nav buttons — centered under logo */}
        <nav className="flex items-center gap-3 text-sm flex-wrap order-3 md:order-none justify-center w-full">
          {/* HOME */}
          <Link
            href="/"
            aria-label="Home"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            🔥 {t("nav.home", lang)}
          </Link>

          {/* DONATE */}
          <Link
            href="/donate"
            aria-label="Donate"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ❤️ {t("nav.donate", lang)}
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            aria-label="About"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ✝️ {t("nav.about", lang)}
          </Link>

          {/* Language Selector */}
          <select
            aria-label={t("lang.selector.label", lang)}
            value={lang}
            onChange={handleLangChange}
            className="ml-2 px-2 py-1 border rounded-md bg-white text-black"
          >
            <option value="en">{t("lang.en", lang)}</option>
            <option value="es">{t("lang.es", lang)}</option>
            <option value="fr">{t("lang.fr", lang)}</option>
            <option value="pt">{t("lang.pt", lang)}</option>
          </select>
        </nav>
      </div>
    </header>
  );
}
