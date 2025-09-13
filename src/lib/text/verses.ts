// src/lib/text/verses.ts
import pool from "../../data/verses.json";

export type ToneVariant = "gentle" | "bold" | "comfort" | "hope";

export interface RotationInput {
  tone?: ToneVariant;                 // tone_variant maps to verse pool
  seed?: string;                      // optional seed for determinism
  avoid?: string[];                   // recently used verse IDs
}

/** FNV-1a style tiny hash for deterministic picking */
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function chooseIndex(len: number, seed: string | undefined): number {
  if (!len) return 0;
  if (!seed) return Math.floor(Math.random() * len);
  return hashStr(seed) % len;
}

export function getVersePool(tone: ToneVariant | undefined) {
  const key = tone || "gentle";
  const list = (pool as Record<string, { id: string; ref: string; text?: string }[]>)[key] || [];
  return list;
}

/**
 * Selects a verse respecting recent-avoid list. If all are avoided,
 * falls back to a deterministic pick by (seed % length).
 */
export function selectVerse(input: RotationInput) {
  const { tone, seed, avoid } = input;
  const avoidSet = new Set((avoid || []).map((s) => s.trim()).filter(Boolean));
  const list = getVersePool(tone);

  const candidates = list.filter((v) => !avoidSet.has(v.id));
  if (candidates.length > 0) {
    const idx = chooseIndex(candidates.length, seed);
    return candidates[idx];
  }

  // fallback: everything is avoided → pick deterministic from full list
  const idx = chooseIndex(list.length, seed);
  return list[idx];
}
