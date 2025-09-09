"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE =
  (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8000";

type MapResp = { themes?: string[]; candidates?: string[] };
type ComposeResp = { sections?: Record<string, string>; anchor?: string };

export default function JFTester() {
  const [health, setHealth] = useState<null | { ok: boolean; version?: string }>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [emotion, setEmotion] = useState("anxiety");
  const [personName, setPersonName] = useState("Jose");
  const [situation, setSituation] = useState("Facing uncertainty about work this week");
  const [pronoun, setPronoun] = useState<"we" | "I">("we");

  const [mapResult, setMapResult] = useState<MapResp | null>(null);
  const [composeResult, setComposeResult] = useState<ComposeResp | null>(null);
  const [busy, setBusy] = useState(false);

  const api = useMemo(() => (API_BASE || "").replace(/\/$/, ""), []);

  useEffect(() => {
    const check = async () => {
      try {
        setChecking(true);
        setError(null);
        const res = await fetch(`${api}/healthz`);
        const data = await res.json();
        setHealth(data);
      } catch (e: unknown) {
        // Correct error handling with type narrowing
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Health check failed");
        }
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [api]);

  const doMap = async () => {
    try {
      setBusy(true);
      setError(null);
      setMapResult(null);
      const res = await fetch(`${api}/dhll/map`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, language: "en" }),
      });
      const data = await res.json();
      // Ensure type safety by checking data type
      if (data && typeof data === "object") {
        setMapResult(data as MapResp);
      } else {
        setError("Invalid response format for map");
      }
    } catch (e: unknown) {
      // Correct error handling with type narrowing
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Map failed");
      }
    } finally {
      setBusy(false);
    }
  };

  const doCompose = async () => {
    try {
      setBusy(true);
      setError(null);
      setComposeResult(null);
      const res = await fetch(`${api}/dhll/compose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion,
          language: "en",
          pronoun_style: pronoun,
          person_name: personName || undefined,
          situation: situation || undefined,
          show_anchor: true,
        }),
      });
      const data = await res.json();
      // Ensure type safety by checking data type
      if (data && typeof data === "object") {
        setComposeResult(data as ComposeResp);
      } else {
        setError("Invalid response format for compose");
      }
    } catch (e: unknown) {
      // Correct error handling with type narrowing
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Compose failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">JirehFaith · Frontend ↔ Backend Tester</h1>
          <div className="text-sm">
            <span className="font-mono">API_BASE:</span>{" "}
            <span className="font-mono">{api}</span>
          </div>
        </header>

        <section className="p-4 rounded-2xl border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Health:</span>
            {checking ? (
              <span className="px-2 py-1 rounded bg-gray-200">Checking…</span>
            ) : health?.ok ? (
              <span className="px-2 py-1 rounded bg-green-200">
                OK {health?.version ? `· ${health.version}` : ""}
              </span>
            ) : (
              <span className="px-2 py-1 rounded bg-red-200">Unavailable</span>
            )}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </section>

        <section className="grid gap-4 p-4 rounded-2xl border">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Emotion</label>
            <input
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="border rounded-lg px-3 py-2"
              placeholder="e.g., anxiety, joy"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Name (optional)</label>
            <input
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="border rounded-lg px-3 py-2"
              placeholder="e.g., Jose"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Situation (optional)</label>
            <input
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="border rounded-lg px-3 py-2"
              placeholder="e.g., Facing uncertainty about work this week"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Pronoun Style</label>
            <select
              value={pronoun}
              onChange={(e) => setPronoun(e.target.value as "I" | "we")}
              className="border rounded-lg px-3 py-2"
            >
              <option value="we">we</option>
              <option value="I">I</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={doMap}
              disabled={busy}
              className="px-4 py-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
            >
              Map Verses
            </button>
            <button
              onClick={doCompose}
              disabled={busy}
              className="px-4 py-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
            >
              Compose Prayer
            </button>
          </div>
        </section>

        {mapResult && (
          <section className="p-4 rounded-2xl border">
            <h2 className="font-semibold mb-2">Mapped Themes & Candidates</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(mapResult, null, 2)}
            </pre>
          </section>
        )}

        {composeResult && (
          <section className="p-4 rounded-2xl border">
            <h2 className="font-semibold mb-2">Composed Prayer</h2>
            {composeResult.sections ? (
              <div className="space-y-2">
                {Object.entries(composeResult.sections).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-sm font-semibold">{k}</div>
                    <p className="text-sm">{v}</p>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(composeResult, null, 2)}
              </pre>
            )}
            {composeResult.anchor && (
              <p className="text-sm mt-2">
                <span className="font-semibold">Anchor:</span> {composeResult.anchor}
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
