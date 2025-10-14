// src/lib/i18n.ts
// Minimal i18n helper for JirehFaith (RC9)
// - Supports EN/ES/FR/PT
// - Persists choice in localStorage ("jf_lang")
// - Lazy-loads JSON dictionaries (code-split)
// - Safe on SSR (guards window access)

export type Lang = "en" | "es" | "fr" | "pt";

type Dict = Record<string, string>;

const STORAGE_KEY = "jf_lang";
const SUPPORTED: Lang[] = ["en", "es", "fr", "pt"];

// --- Env / platform guards ---------------------------------------------------

const isBrowser = typeof window !== "undefined";

// Normalize any input (e.g., "fr-CA") to one of our supported langs
function normalizeLang(input?: string | null): Lang {
  const raw = (input || "").toLowerCase();
  if (SUPPORTED.includes(raw as Lang)) return raw as Lang;
  const iso2 = raw.split("-")[0] as Lang;
  if (SUPPORTED.includes(iso2)) return iso2;
  return "en";
}

// Simple mustache-style interpolation: "Hello {{name}}"
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{\s*([.\w-]+)\s*\}\}/g, (_, k) =>
    Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : `{{${k}}}`
  );
}

// --- Persistence -------------------------------------------------------------

export function getLang(): Lang {
  // 1) user choice
  if (isBrowser) {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeLang(stored);
  }
  // 2) browser language (first match)
  if (isBrowser && typeof navigator !== "undefined") {
    const navLang =
      (navigator.languages && navigator.languages[0]) ||
      (navigator as any).userLanguage ||
      navigator.language;
    return normalizeLang(navLang);
  }
  // 3) default
  return "en";
}

export function setLang(lang: Lang) {
  const normalized = normalizeLang(lang);
  if (isBrowser) {
    window.localStorage.setItem(STORAGE_KEY, normalized);
    // Notify listeners
    window.dispatchEvent(new CustomEvent("jf:lang", { detail: normalized }));
  }
}

// --- Dictionary loading (lazy, cached) --------------------------------------

const cache: Partial<Record<Lang, Dict>> = {};

/**
 * Dynamically import locale JSON and strip non-string metadata
 * so it matches Dict = Record<string, string>.
 */
async function importDict(lang: Lang): Promise<Dict> {
  let raw: any;
  switch (lang) {
    case "en": raw = (await import("../i18n/en.json")).default; break;
    case "es": raw = (await import("../i18n/es.json")).default; break;
    case "fr": raw = (await import("../i18n/fr.json")).default; break;
    case "pt": raw = (await import("../i18n/pt.json")).default; break;
    default:   raw = (await import("../i18n/en.json")).default; break;
  }
    // Strip metadata without binding an unused variable
  const rest: any = { ...(raw || {}) };
  delete rest._meta;

   const dict: Dict = Object.fromEntries(
    Object.entries(rest).map(([k, v]) => [k, typeof v === "string" ? v : String(v)])
  );
  return dict;
}

/**
 * Ensure the dictionary for `lang` is loaded into cache.
 * Call this once (e.g., in a client effect) before reading strings.
 */
export async function ensureLocale(lang: Lang) {
  const L = normalizeLang(lang);
  if (!cache[L]) {
    cache[L] = await importDict(L);
  }
}

/**
 * Get a string synchronously from cache.
 * If not loaded yet, returns the key as a fallback.
 */
export function t(key: string, lang?: Lang, vars?: Record<string, string | number>): string {
  const L = normalizeLang(lang || getLang());
  const dict = cache[L];
  const template = dict?.[key] ?? key;
  return interpolate(template, vars);
}

/**
 * Convenience: Preload the current language dictionary.
 * Useful on app start (client) to avoid flashes of keys.
 */
export async function preloadCurrentLang() {
  await ensureLocale(getLang());
}

// --- Optional tiny event helper for components ------------------------------

/**
 * Subscribe to language changes fired by setLang().
 * Returns an unsubscribe function.
 */
export function onLangChange(fn: (lang: Lang) => void): () => void {
  if (!isBrowser) return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as Lang | undefined;
    if (detail) fn(detail);
  };
  window.addEventListener("jf:lang", handler as EventListener);
  return () => window.removeEventListener("jf:lang", handler as EventListener);
}
