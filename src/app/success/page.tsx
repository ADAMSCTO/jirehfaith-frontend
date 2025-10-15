"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLang, t, preloadCurrentLang } from "@/lib/i18n";

export default function SuccessPage() {
  const [lang, setLang] = useState<"en" | "es" | "fr" | "pt">("en");

  useEffect(() => {
    preloadCurrentLang();
    setLang(getLang());
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--brand-gold)" }}>
        {t("donate.successTitle", lang) ?? "Thank you for your gift!"}
      </h1>
      <p className="text-base mb-6">
        {t("donate.successBody", lang) ??
          "Your donation was received. A receipt will be sent to your email if applicable."}
      </p>
      <Link
        href="/"
        className="inline-block rounded-xl border px-4 py-2 hover:shadow"
        aria-label="Return home"
      >
        {t("donate.backHome", lang) ?? "Back to Home"}
      </Link>
    </main>
  );
}
