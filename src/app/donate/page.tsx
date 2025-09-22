"use client";

import { useEffect, useState } from "react";
import { PAYMENT_LINKS } from "@/lib/payments";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";

type Btn = {
  key: "stripe" | "paypal" | "applepay" | "googlepay";
};

const BUTTONS: Btn[] = [
  { key: "stripe" },
  { key: "paypal" },
  { key: "applepay" },
  { key: "googlepay" }
];

export default function DonatePage() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const current = getLang();
    setLangState(current);
    preloadCurrentLang();
    const unsub = onLangChange((l) => setLangState(l));
    return () => unsub();
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: "var(--brand-gold)" }}
      >
        {t("donate.title", lang)}
      </h1>

      <p className="text-base mb-6">
        {t("donate.lead", lang)}
      </p>

      <div className="grid gap-3">
        {BUTTONS.map(({ key }) => {
          const raw = PAYMENT_LINKS[key];
          const enabled = raw && raw !== "#";
          const href = enabled ? raw : undefined;

          return (
            <a
              key={key}
              href={href}
              onClick={enabled ? undefined : (e) => e.preventDefault()}
              aria-disabled={enabled ? undefined : "true"}
              className={
                "w-full rounded-xl border px-4 py-3 text-left transition " +
                (enabled ? "hover:shadow" : "opacity-60 cursor-not-allowed")
              }
              target={enabled ? "_blank" : undefined}
              rel={enabled ? "noopener noreferrer" : undefined}
              title={enabled ? undefined : t("donate.note", lang)}
            >
              {t(`donate.${key}`, lang)}
              {!enabled ? " " + t("donate.comingSoon", lang) : ""}
            </a>
          );
        })}
      </div>

      <p className="text-xs mt-4 opacity-80">
        {t("donate.note", lang)}
      </p>
    </main>
  );
}
