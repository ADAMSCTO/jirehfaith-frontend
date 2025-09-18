"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TComposeRequest, TComposeResponse } from "@/lib/schemas";
import { getTopics, getNextNonRepeatingVerse, type Verse } from "@/lib/verses";
import { getLang, onLangChange, preloadCurrentLang, type Lang } from "@/lib/i18n";

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
  // Always start at top when landing on Home (fixes half-way render on return)
  useEffect(() => {
    try {
      // Try instant if supported
      (window as any).scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch {
      try { window.scrollTo(0, 0); } catch {}
    }
    const top = document.getElementById("page-top");
    if (top && typeof top.scrollIntoView === "function") {
      try { (top as any).scrollIntoView({ behavior: "instant", block: "start" }); } catch {}
    }
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

          {/* Left icon (praying hands, gold-outline) */}
                              <img
            src="/icons/praying-hands-gold.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8"
          />

          {/* Title text */}
          Prayer Composer with The Holy Bible Scriptures

          {/* Right icon (open Bible, gold-outline) */}
                              <img
            src="/open-bible-gold.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8"
          />

        </h1>
      </header>

      <div className="grid gap-3 md:h-full grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-2 items-stretch">
        {/* LEFT: form */}
        <section className="border rounded-lg p-3 space-y-2 bg-white shadow-sm min-h-[360px] flex flex-col">
                    <div
            className="flex-1 min-h-0 space-y-3"
onKeyDown={(e) => {
  if (e.key === "Enter" && !compose.isPending) {
    e.preventDefault();
    compose.mutate({
      emotion,
      language: lang,
      pronoun_style: pronoun,
      person_name: personName ? toTitleCase(personName) : undefined,
      situation: normalizeSituation(situation) || undefined,
      show_anchor: showAnchor,
    });
  }
}}
>
  {/* Scripture topic + selector */}
  <div>
    <label htmlFor="topic" className="block text-sm font-medium mb-1">
      Scripture topic
    </label>
    <div className="flex items-center gap-2 flex-wrap w-full">
      <select
        id="topic"
        name="topic"
        aria-label="Scripture topic"
        autoComplete="off"
        className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={compose.isPending}
        aria-disabled={compose.isPending ? true : undefined}
      >
        {topics.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg bg-black text-white px-3 py-2 disabled:opacity-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
        onClick={() => {
         setVerse(getNextNonRepeatingVerse(topic));
         setTimeout(() => {
          document.getElementById("prayer-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
         }, 0);
        }}
        disabled={compose.isPending}
        aria-disabled={compose.isPending ? true : undefined}
        title="Show a verse for the selected topic"
      >
        Show verse
      </button>
<button
  type="button"
  className="inline-flex items-center justify-center rounded-lg bg-white text-black border px-3 py-2 disabled:opacity-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
  onClick={() => {
  setVerse(null);
  setTimeout(() => {
    document.getElementById("prayer-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
}}
  disabled={!verse}
  aria-disabled={!verse ? true : undefined}
  title="Clear the displayed verse"
>
  Clear verse
</button>
    </div>
  </div>

            {/* Emotion */}
            <div>
              <label htmlFor="emotion" className="block text-sm font-medium mb-1">
                Emotion
              </label>
                            <select
                id="emotion"
                name="emotion"
                aria-label="Emotion"
                autoComplete="off"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                disabled={compose.isPending}
                aria-disabled={compose.isPending ? true : undefined}
              >
                <option value="anxiety">anxiety</option>
                <option value="grief">grief</option>
                <option value="fear">fear</option>
                <option value="anger">anger</option>
                <option value="love">love</option>
                <option value="perseverance">perseverance</option>
                <option value="hope">hope</option>
                <option value="joy">joy</option>
              </select>
            </div>

            {/* Pronoun style */}
            <div>
              <label htmlFor="pronoun-style" className="block text-sm font-medium mb-1">
                Pronoun style
              </label>
                            <select
                id="pronoun-style"
                name="pronoun_style"
                aria-label="Pronoun style"
                autoComplete="off"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                value={pronoun}
                onChange={(e) =>
                  setPronoun(e.target.value as TComposeRequest["pronoun_style"])
                }
                disabled={compose.isPending}
                aria-disabled={compose.isPending ? true : undefined}
              >
                <option value="i">I / me / my</option>
                <option value="we">We / us / our</option>
                <option value="he">He / him / his</option>
                <option value="she">She / her / her</option>
                <option value="they">They / them / their</option>
              </select>
            </div>

            {/* Person name */}
            <div>
              <label htmlFor="person-name" className="block text-sm font-medium mb-1">
                Person name (optional)
              </label>
                            <input
                id="person-name"
                name="person_name"
                type="text"
                aria-label="Person name"
                autoComplete="given-name"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g., John"
                disabled={compose.isPending}
                aria-disabled={compose.isPending ? true : undefined}
              />
            </div>

            {/* Situation */}
            <div>
              <label htmlFor="situation" className="block text-sm font-medium mb-1">
                Situation (optional)
              </label>
                            <input
                id="situation"
                name="situation"
                type="text"
                aria-label="Situation"
                autoComplete="off"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g., upcoming surgery"
                disabled={compose.isPending}
                aria-disabled={compose.isPending ? true : undefined}
              />
            </div>

            {/* Toggle + Compose row */}
            <div className="mt-1 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                                <input
                  id="show-anchor"
                  name="show_anchor"
                  type="checkbox"
                  checked={showAnchor}
                  onChange={(e) => setShowAnchor(e.target.checked)}
                  disabled={compose.isPending}
                  aria-disabled={compose.isPending ? true : undefined}
                />
                <label htmlFor="show-anchor" className="text-sm">
                  Show anchor
                </label>
              </div>

                            <button
                aria-label="Compose prayer"
                title="Compose prayer"
                className="inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50 w-full sm:w-auto shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                disabled={compose.isPending}
                aria-disabled={compose.isPending ? true : undefined}
                aria-controls="prayer-output"
                aria-busy={compose.isPending ? true : undefined}
                onClick={() =>
                  compose.mutate({
                    emotion,
                    language: lang,
                    pronoun_style: pronoun,
                    person_name: personName ? toTitleCase(personName) : undefined,
                    situation: normalizeSituation(situation) || undefined,
                    show_anchor: showAnchor,
                  })
                }
              >
                {compose.isPending ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                    </svg>
                    Composing…
                  </>
                ) : (
                  "Compose prayer"
                )}
              </button>
            </div>
          </div>

          {compose.isError && (
            <p className="text-red-600 text-sm mt-2">
              Error: {(compose.error as any)?.message || "Unknown error"}
            </p>
          )}
        </section>

        {/* RIGHT: output */}
        <section className="border rounded-lg p-3 bg-white shadow-sm min-h-[360px] flex flex-col">
          {/* Non-sticky header */}
          <div className="mb-3 flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-medium">Prayer</h2>
          </div>

          {/* Content area */}
          <div id="prayer-output" key={clearNonce} className="flex-1 min-h-0 space-y-4" aria-live="polite" aria-busy={compose.isPending ? true : undefined}>
{/* Scripture display (if selected) */}
{verse && (
  <div className="rounded-md bg-[var(--header)]/20 border p-2">
    <div className="text-sm font-medium">Scripture</div>
    <div className="text-sm italic whitespace-pre-wrap">{verse.text}</div>
    <div className="text-xs mt-1">{verse.reference} ({verse.version})</div>
  </div>
)}

            {(!compose.data || sections.length === 0) && (
              <p className="text-gray-500 text-sm">No prayer yet.</p>
            )}

            {sections.length > 0 && (
              <>
                {sections.map((s: any, idx: number) => (
                  <div key={idx}>
                    <div className="font-semibold">{prettyTitle(String(s.title))}</div>
                    <div className="whitespace-pre-wrap">{s.content}</div>
                  </div>
                ))}

                {anchor && (
                  <div className="border-t pt-3 text-sm">
                    <div className="font-semibold">Anchor</div>
                    <div className="whitespace-pre-wrap">
                      {anchor.ref}
                      {anchor.text ? ` — ${anchor.text}` : ""}
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500 italic">{ATTRIBUTION}</div>
                
              </>
            )}
          </div>

          {/* Footer with Copy button (always rendered, disabled until content exists) */}
          <div className="mt-4 pt-2 border-t">
                        <button
              aria-label="Copy full prayer"
              title="Copy full prayer"
              className="text-sm rounded-md border px-3 py-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              disabled={!hasPrayer}
              aria-controls="prayer-output"
              aria-describedby="copy-status"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fullPrayer);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
<button
  aria-label="Clear prayer output"
  title="Clear prayer output"
  className="ml-2 text-sm rounded-md border px-3 py-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
  onClick={() => {
    setVerse(null);
    compose.reset();
    setClearNonce((n) => n + 1);
  }}
  disabled={!hasOutput}
  aria-disabled={!hasOutput ? true : undefined}
>
  Clear
</button>

            {/* Screen-reader live region for copy feedback; Toast will replace this visually in Phase 3 */}
            <div id="copy-status" role="status" aria-live="polite" className="sr-only">
              {copied ? "Copied to clipboard" : ""}
            </div>
          </div>
        </section>
      </div>
          <Toast show={copied}>Copied to clipboard</Toast>
    </main>
  );
}
