"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TComposeRequest, TComposeResponse } from "@/lib/schemas";
import { getLang, onLangChange, preloadCurrentLang, t, type Lang } from "@/lib/i18n";
import { LanguageProvider } from "@/lib/LanguageContext";

const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "JirehFaith";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jirehfaith.com";
const ATTRIBUTION = `— Source: ${SITE_NAME} (${SITE_URL})`;

/** ---------------- Utility helpers ---------------- */
function prettyTitle(title: string) {
  const key = String(title || "").replace(/_/g, " ").trim();
  if (key.toLowerCase() === "yielding listening" || key.toLowerCase() === "yielding_listening") {
    return "Yielding / Listening";
  }
  return key.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/** Normalize backend sections to an array */
function normalizeSections(data: any) {
  const raw = (data as any)?.sections ?? (data as any)?.output ?? data;

  if (Array.isArray(raw)) {
    return raw.map((s: any) => ({
      title: String(s?.title ?? s?.name ?? ""),
      content: String(s?.content ?? s?.body ?? ""),
    }));
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([title, content]) => ({
      title,
      content: String(
        (content as any)?.content ?? (content as any)?.body ?? content ?? ""
      ),
    }));
  }
  if (typeof raw === "string") {
    return [{ title: t("output.prayer"), content: raw }];
  }
  return [];
}

/**
 * Emphasize the parenthetical where users speak their situation/condition:
 *  - EN: (state your condition)
 *  - ES: (declara tu condición)
 *  - FR: (exprimez votre situation)
 *  - PT: (diga a sua condição)
 * Also tolerant of variants: situation/situación/situação, condición/condição, condition.
 */
function emphasizePersonalCueInline(s: string) {
  const safe = String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const pattern =
    /\(([^)]*(?:state your condition|condition|condici[oó]n|condi[cç][aã]o|situ[aã]?[cç][aã]o|situaci[oó]n|situ[aã]o|situation)[^)]*)\)/giu;
  return safe.replace(pattern, (_m, inner) => `<strong>(${inner})</strong>`);
}

/** Localized label for emotion IDs; falls back to title-cased ID when no key exists. */
function labelForEmotion(id: string): string {
  try {
    const key = `emotion.${id}`;
    const translated = t(key);
    if (translated === key) {
      return id.replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    }
    return translated;
  } catch {
    return id.replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }
}

/** Stopgap list + hydration (from Mission 1) */
const STOPGAP_EMOTIONS = [
  "anxiety",
  "grief",
  "fear",
  "anger",
  "love",
  "perseverance",
  "hope",
  "joy",
  "financial_trials",
  "relationship_trials",
  "illness",
  "despair",
  // Added in Mission 1
  "peace",
  "success",
  "protection",
];

export default function Home() {
  const [emotion, setEmotion] = useState("anxiety");
  const [emotionOptions, setEmotionOptions] = useState<string[]>(STOPGAP_EMOTIONS);

  // ACTS-Y only UI
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"en" | "es" | "fr" | "pt">("en");
  const [clearNonce, setClearNonce] = useState(0);

  // Keep page language in sync with global i18n (Header selector)
  useEffect(() => {
    try {
      preloadCurrentLang();
    } catch {}
    const current = getLang();
    setLang(current as "en" | "es" | "fr" | "pt");
    const unsub = onLangChange((l: Lang) => setLang(l as "en" | "es" | "fr" | "pt"));
    return () => {
      try {
        if (typeof unsub === "function") unsub();
      } catch {}
    };
  }, []);

  // Hydrate emotions from backend and merge + de-dup with STOPGAP_EMOTIONS (with 2s timeout)
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2000);

    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/dhll/emotions", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const json = await res.json().catch(() => ({}));
        const server = Array.isArray((json as any)?.emotions)
          ? (json as any).emotions
          : Array.isArray(json)
          ? (json as string[])
          : [];
        const merged = Array.from(new Set([...STOPGAP_EMOTIONS, ...server]));
        if (!cancelled) setEmotionOptions(merged);
      } catch {
        // keep STOPGAP_EMOTIONS
      } finally {
        window.clearTimeout(timeoutId);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  /** Compose client — ACTS-Y only (no pronoun/person/situation).
   *  NOTE: Removed auto scroll to avoid header overlap.
   */
  const compose = useMutation({
    mutationFn: async (input: TComposeRequest) => {
      const startedAt = Date.now();
      const { data } = await api.post<TComposeResponse>(
        "http://127.0.0.1:8000/dhll/compose",
        input,
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
      const elapsed = Date.now() - startedAt;
      try {
        localStorage.setItem("jf:lastResponseMs", String(elapsed));
        localStorage.setItem("jf:lastResponseAt", new Date().toISOString());
      } catch {}
      return data;
    },
    onSuccess: () => {
      // intentionally no scrollIntoView to prevent sliding under fixed header
    },
  });

  const sections = normalizeSections(compose.data);
  const anchor = (compose.data as any)?.anchor;
  const closing = (compose.data as any)?.closing || "";
  const footer = (compose.data as any)?.footer || "";

  const prayerBase =
    compose.data && (compose.data as any).prayer
      ? String((compose.data as any).prayer)
      : sections.map((s: any) => `${prettyTitle(String(s.title))}\n${s.content}`).join("\n\n");

  const anchorBlock =
    anchor && (anchor.reference || anchor.text)
      ? `${anchor.reference ?? ""}${anchor.version ? ` (${anchor.version})` : ""}${anchor.text ? `\n${anchor.text}` : ""}`
      : "";

  // Include closing + footer in the copied text
  const fullPrayer = [prayerBase, anchorBlock, closing, footer, ATTRIBUTION]
    .filter(Boolean)
    .join("\n\n");

  const hasPrayer = sections.length > 0;

  return (
    <LanguageProvider>
      {/* NOTE:
          - Top padding is intentionally small (pt-2 md:pt-4) to keep content close to the fixed header
          - Do NOT remove without re-testing header overlap on scroll/growth
      */}
      <main
        id="page-top"
        className="p-3 md:p-4 pt-2 md:pt-4 max-w-6xl mx-auto min-h-[calc(100dvh-64px)] overflow-x-hidden"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            const details = document.querySelector("details");
            if (details && (details as HTMLDetailsElement).open) {
              details.removeAttribute("open");
            }
          }
          // Enter triggers compose
          if (e.key === "Enter" && !compose.isPending) {
            e.preventDefault();
            compose.mutate({
              emotion,
              language: lang,
              show_anchor: true, // always show anchor
            } as any);
          }
        }}
        tabIndex={0}
      >
        <header className="mb-1">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-center flex items-center justify-center gap-2 px-2"
            style={{ color: "var(--brand-gold)" }}
          >
            <Image
              src="/icons/praying-hands-gold.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            {t("page.title")}
            <Image
              src="/open-bible-gold.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </h1>
        </header>

        {/* Grid uses items-start so Input (left) does NOT stretch to match Output height */}
        <div className="grid gap-2 grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-2 items-start">
          {/* LEFT: form */}
          <section className="self-start border rounded-lg p-3 space-y-2 bg-white shadow-sm min-h-[200px] flex flex-col">
            <div className="space-y-3">
              {/* Emotion (hydrated + stopgap) */}
              <div>
                <label htmlFor="emotion" className="block text-sm font-medium mb-1">
                  {t("input.emotion")}
                </label>
                <select
                  id="emotion"
                  name="emotion"
                  aria-label={t("input.emotion")}
                  autoComplete="off"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  disabled={compose.isPending}
                  aria-disabled={compose.isPending ? true : undefined}
                >
                  {emotionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {labelForEmotion(opt)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Compose row only */}
              <div className="mt-1 flex items-center justify-between gap-3 flex-wrap">
                <button
                  aria-label={t("a11y.compose")}
                  title={t("a11y.compose")}
                  className="inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50 w-full sm:w-auto shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                  disabled={compose.isPending}
                  aria-disabled={compose.isPending ? true : undefined}
                  aria-controls="prayer-output"
                  aria-busy={compose.isPending ? true : undefined}
                  onClick={() =>
                    compose.mutate({
                      emotion,
                      language: lang,
                      show_anchor: true, // always request anchor
                    } as any)
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
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeOpacity="0.25"
                          strokeWidth="4"
                        />
                        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                      </svg>
                      {t("composer.compose")}
                    </>
                  ) : (
                    t("composer.compose")
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
              <h2 className="text-xl font-medium flex items-center justify-center gap-2">
{hasPrayer ? (
  <><img src="/icons/praying-hands-gold.png" alt="" aria-hidden="true" className="h-6 w-6" />
  {t("output.prayerFor").replace("{{emotion}}", labelForEmotion(emotion).toLocaleLowerCase(lang))}
  <img src="/open-bible-gold.png" alt="" aria-hidden="true" className="h-6 w-6" /></>
) : t("output.prayer")}
</h2>
            </div>

            {/* Content area (no auto-scroll here; main padding prevents header overlap) */}
            <div
              id="prayer-output"
              key={clearNonce}
              className="flex-1 min-h-0 space-y-4"
              aria-live="polite"
              aria-busy={compose.isPending ? true : undefined}
            >
              {(!compose.data || sections.length === 0) && (
                <p className="text-gray-500 text-sm">{t("output.noPrayerYet")}</p>
              )}

              {sections.length > 0 && (
                <>
                  {sections.map((s: any, idx: number) => (
                    <div key={idx}>
                      <div className="font-semibold">{prettyTitle(String(s.title))}</div>
                      <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: emphasizePersonalCueInline(String(s.content)),
                        }}
                      />
                    </div>
                  ))}

                  {anchor && (
                    <div className="border-t pt-3 text-sm">
                      <div className="font-semibold">{t("output.scripture")}</div>
                      <div className="whitespace-pre-wrap">
                        {anchor.reference}
                        {anchor.version ? ` (${anchor.version})` : ""}
                      </div>
                      {anchor.text && <div className="italic whitespace-pre-wrap mt-1">{anchor.text}</div>}
                    </div>
                  )}

                  {/* Closing + Footer with separator BETWEEN them (no gap after Yielding) */}
                  {(closing || footer) && (
                    <div className="text-sm -mt-4">
                      {closing && <div className="whitespace-pre-wrap">{closing}</div>}
                      {closing && footer && <div className="border-t my-2" />}
                      {footer && <div className="text-xs text-gray-600">{footer}</div>}
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500 italic">{ATTRIBUTION}</div>
                </>
              )}
            </div>

            {/* Footer with Copy/Clear */}
            <div className="mt-4 pt-2 border-t">
              <button
                aria-label={t("a11y.copy")}
                title={t("a11y.copy")}
                className="text-sm rounded-md border px-3 py-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                disabled={!hasPrayer}
                aria-controls="prayer-output"
                aria-describedby="copy-status"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      [
                        sections.map((s: any) => `${prettyTitle(String(s.title))}\n${s.content}`).join("\n\n"),
                        anchor
                          ? `${anchor.reference ?? ""}${anchor.version ? ` (${anchor.version})` : ""}${
                              anchor.text ? `\n${anchor.text}` : ""
                            }`
                          : "",
                        closing,
                        footer,
                        ATTRIBUTION,
                      ]
                        .filter(Boolean)
                        .join("\n\n")
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {}
                }}
              >
                {copied ? t("composer.copied") : t("composer.copy")}
              </button>
              <button
                aria-label={t("a11y.clear")}
                title={t("a11y.clear")}
                className="ml-2 text-sm rounded-md border px-3 py-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                onClick={() => {
                  compose.reset();
                  setClearNonce((n) => n + 1);

                  // Defer + double-pass to defeat WebView timing quirks
                  const doTop = () => {
                    try {
                      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
                      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
                      document.body?.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
                    } catch {
                      window.scrollTo(0, 0);
                    }
                    requestAnimationFrame(() => {
                      try {
                        window.scrollTo(0, 0);
                        (document.scrollingElement as any)?.scrollTo(0, 0);
                        (document.body as any)?.scrollTo(0, 0);
                      } catch {}
                    });
                  };
                  setTimeout(doTop, 0);
                }}
                disabled={!hasPrayer}
                aria-disabled={!hasPrayer ? true : undefined}
              >
                {t("composer.clear")}
              </button>

              <div id="copy-status" role="status" aria-live="polite" className="sr-only">
                {copied ? t("composer.copied") : ""}
              </div>
            </div>
          </section>
        </div>
      </main>
    </LanguageProvider>
  );
}
