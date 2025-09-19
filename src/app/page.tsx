"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TComposeRequest, TComposeResponse } from "@/lib/schemas";
import { getTopics, getNextNonRepeatingVerse, type Verse } from "@/lib/verses";
import { getLang, onLangChange, preloadCurrentLang, type Lang } from "@/lib/i18n";
import { LanguageProvider } from "@/lib/LanguageContext"; // Import the LanguageProvider

const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "JirehFaith";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jirehfaith.com";
const ATTRIBUTION = `— Source: ${SITE_NAME} (${SITE_URL})`;

// Normalize various possible response shapes into an array of {title, content}
function prettyTitle(title: string) {
  const key = String(title || "").replace(/_/g, " ").trim();
  if (key.toLowerCase() === "yielding listening" || key.toLowerCase() === "yielding_listening") {
    return "Yielding / Listening";
  }
  return key.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function toTitleCase(name: string) {
  return String(name || "")
    .trim()
    .replace(/\b\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function normalizeSituation(s: string) {
  const cleaned = String(s || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return cleaned[0].toUpperCase() + cleaned.slice(1);
}

function normalizeSections(data: any) {
  const raw = (data as any)?.sections ?? (data as any)?.output ?? data;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([title, content]) => ({
      title,
      content: String(content ?? ""),
    }));
  }
  if (typeof raw === "string") {
    return [{ title: "Prayer", content: raw }];
  }
  return [];
}

function Toast({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      aria-live="polite"
      role="status"
      aria-atomic="true"
      className={`pointer-events-none fixed bottom-4 right-4 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-auto rounded-md bg-black/85 text-white text-sm px-3 py-2 shadow-lg">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [emotion, setEmotion] = useState("anxiety");
  const [pronoun, setPronoun] = useState<TComposeRequest["pronoun_style"]>("we");
  const [personName, setPersonName] = useState("");
  const [situation, setSituation] = useState("");
  const [showAnchor, setShowAnchor] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"en" | "es" | "fr" | "pt">("en");
  const [topic, setTopic] = useState<string>("comfort");
  const [verse, setVerse] = useState<Verse | null>(null);
  const [clearNonce, setClearNonce] = useState(0);

  // Keep page language in sync with global i18n (controlled by Header selector)
  useEffect(() => {
    try { preloadCurrentLang(); } catch {}
    const current = getLang();
    setLang(current as "en" | "es" | "fr" | "pt");
    const unsub = onLangChange((l: Lang) => setLang(l as "en" | "es" | "fr" | "pt"));
    return () => {
      try { if (typeof unsub === "function") unsub(); } catch {}
    };
  }, []);

  const compose = useMutation({
    mutationFn: async (input: TComposeRequest) => {
      const startedAt = Date.now();
      const { data } = await api.post<TComposeResponse>("/dhll/compose", input);
      const elapsed = Date.now() - startedAt;
      try {
        localStorage.setItem("jf:lastResponseMs", String(elapsed));
        localStorage.setItem("jf:lastResponseAt", new Date().toISOString());
      } catch {}
      return data;
    },
    onSuccess: () => {
      try {
        document
          .getElementById("prayer-output")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    },
  });

  const sections = normalizeSections(compose.data);
  const prayerBase =
    compose.data && (compose.data as any).prayer
      ? String((compose.data as any).prayer)
      : sections.map((s: any) => `${prettyTitle(String(s.title))}\n${s.content}`).join("\n\n");
  const fullPrayer = `${prayerBase}\n\n${ATTRIBUTION}`;
  const anchor = (compose.data as any)?.anchor;
  const topics = getTopics();
  const hasPrayer = sections.length > 0;
  const hasOutput = hasPrayer || !!verse;

  return (
    <LanguageProvider> {/* Wrap the app with LanguageProvider */}
      <main
        id="page-top"
        className="p-3 md:p-4 max-w-6xl mx-auto min-h-[calc(100dvh-64px)] overflow-x-hidden"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            const details = document.querySelector("details");
            if (details && details.open) {
              details.removeAttribute("open");
            }
          }
        }}
        tabIndex={0}
      >
        <header className="mb-4">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-center flex items-center justify-center gap-2 px-2"
            style={{ color: "var(--brand-gold)" }}
          >
            <img
              src="/icons/praying-hands-gold.png"
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
            Prayer Composer with The Holy Bible Scriptures
            <img
              src="/open-bible-gold.png"
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
          </h1>
        </header>

        <div className="grid gap-3 md:h-full grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-2 items-stretch">
          {/* Content... */}
        </div>
      </main>
    </LanguageProvider>
  );
}
