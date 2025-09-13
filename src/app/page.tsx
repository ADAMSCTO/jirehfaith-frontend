"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TComposeRequest, TComposeResponse } from "@/lib/schemas";

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
// --- RC7 helpers: tone mapping & recent-avoid list --------------------------
function mapToneVariant(emotion: string): TComposeRequest["tone_variant"] {
  const e = String(emotion || "").toLowerCase();
  if (["grief", "sorrow", "loss"].includes(e)) return "comfort";
  if (["fear", "anxiety", "worry", "stress"].includes(e)) return "gentle";
  if (["perseverance", "courage", "resolve"].includes(e)) return "bold";
  if (["hope", "joy", "love"].includes(e)) return "hope";
  // default
  return "gentle";
}

/**
 * Reads a small recent-avoid list from localStorage (key: 'recentVerses').
 * Shape: { [tone: string]: string[] }
 */
function getRecentAvoid(tone?: string): string[] {
  try {
    const raw = localStorage.getItem("recentVerses");
    if (!raw) return [];
    const byTone = JSON.parse(raw) as Record<string, string[]>;
    if (!tone) return [];
    const arr = byTone[tone] || [];
    return Array.isArray(arr) ? arr.filter(Boolean).slice(0, 5) : [];
  } catch {
    return [];
  }
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

  const compose = useMutation({
    mutationFn: async (input: TComposeRequest) => {
      const { data } = await api.post<TComposeResponse>("/dhll/compose", input);
      return data;
    },
  });

  const sections = normalizeSections(compose.data);
  const prayerBase =
    compose.data && (compose.data as any).prayer
      ? String((compose.data as any).prayer)
      : sections.map((s: any) => `${prettyTitle(String(s.title))}\n${s.content}`).join("\n\n");
  const fullPrayer = `${prayerBase}\n\n${ATTRIBUTION}`;
  const anchor = (compose.data as any)?.anchor;

  return (
        <main
      className="p-3 md:p-4 max-w-6xl mx-auto min-h-[calc(100dvh-64px)] md:h-[calc(100dvh-72px)] overflow-x-hidden md:overflow-hidden"
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
        <section className="border rounded-lg p-3 space-y-2 bg-white shadow-sm min-h-[360px] md:h-[calc(100vh-240px)] flex flex-col overflow-auto">
                    <div
            className="flex-1 min-h-0 space-y-3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !compose.isPending) {
                e.preventDefault();
                compose.mutate({
  emotion,
  language: "en",
  pronoun_style: pronoun,
  person_name: personName ? toTitleCase(personName) : undefined,
  situation: normalizeSituation(situation) || undefined,
  show_anchor: showAnchor,

  // RC7 additions:
  tone_variant: mapToneVariant(emotion),
  verse_rotation: {
    avoid: getRecentAvoid(mapToneVariant(emotion)),
  },
                });
              }
            }}
          >
            {/* Emotion */}
            <div>
              <label htmlFor="emotion" className="block text-sm font-medium mb-1">
                Emotion
              </label>
                            <select
                id="emotion"
                aria-label="Emotion"
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
                aria-label="Pronoun style"
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
                type="text"
                aria-label="Person name"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g., John"
                disabled={compose.isPending}
                aria-disabled={compose
