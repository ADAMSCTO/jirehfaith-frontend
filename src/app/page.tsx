"use client";

import { useState } from "react";
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
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-2">JirehFaith — Prayer Composer</h1>
      <p className="text-sm text-gray-600 mb-6">
        Backend: {process.env.NEXT_PUBLIC_API_BASE || "not set"}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* LEFT: form */}
        <section className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
          {/* Emotion */}
          <div>
            <label className="block text-sm font-medium mb-1">Emotion</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Pronoun style</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              value={pronoun}
              onChange={(e) =>
                setPronoun(e.target.value as TComposeRequest["pronoun_style"])
              }
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
            <label className="block text-sm font-medium mb-1">Person name (optional)</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g., John"
            />
          </div>

          {/* Situation */}
          <div>
            <label className="block text-sm font-medium mb-1">Situation (optional)</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., upcoming surgery"
            />
          </div>

          {/* Show anchor toggle */}
          <div className="flex items-center gap-2 mt-1">
            <input
              id="show-anchor"
              type="checkbox"
              checked={showAnchor}
              onChange={(e) => setShowAnchor(e.target.checked)}
            />
            <label htmlFor="show-anchor" className="text-sm">Show anchor</label>
          </div>

          {/* Compose */}
          <button
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50 w-full sm:w-auto self-start"
            disabled={compose.isPending}
            onClick={() =>
              compose.mutate({
                emotion,
                language: "en",
                pronoun_style: pronoun,
                person_name: personName ? toTitleCase(personName) : undefined,
                situation: normalizeSituation(situation) || undefined,
                show_anchor: showAnchor,
              })
            }
          >
            {compose.isPending ? "Composing…" : "Compose prayer"}
          </button>

          {compose.isError && (
            <p className="text-red-600 text-sm mt-2">
              Error: {(compose.error as any)?.message || "Unknown error"}
            </p>
          )}
        </section>

        {/* RIGHT: output */}
        <section className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-medium">Prayer</h2>
            <button
              className="text-sm rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={!compose.data || sections.length === 0}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fullPrayer);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {}
              }}
              title="Copy full prayer to clipboard"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {(!compose.data || sections.length === 0) && (
            <p className="text-gray-500 text-sm">No prayer yet.</p>
          )}

          {sections.length > 0 && (
            <div className="space-y-4">
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

              <details className="mt-2 text-xs text-gray-500">
                <summary>Debug (raw response)</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">
{JSON.stringify(compose.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
