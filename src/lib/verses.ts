// src/lib/verses.ts
// Simple helpers for selecting scripture verses by topic.
// Assumes Next.js + TypeScript with resolveJsonModule enabled (default).

import verses from "@/data/verses.json";

export type Verse = {
  topic: string;
  reference: string;
  version: string;
  text: string;
};

export type Topic = string;

export function getAllVerses(): Verse[] {
  return verses as Verse[];
}

export function getTopics(): Topic[] {
  const set = new Set<string>();
  getAllVerses().forEach(v => set.add(v.topic));
  return Array.from(set).sort();
}

export function getRandomVerseByTopic(topic: string): Verse | null {
  const pool = getAllVerses().filter(v => v.topic.toLowerCase() === topic.toLowerCase());
  if (pool.length === 0) return null;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// Basic rotation memory (in-memory per session, resets on reload)
const recentByTopic: Record<string, string[]> = {};

export function getNextNonRepeatingVerse(topic: string, maxRecent = 10): Verse | null {
  const pool = getAllVerses().filter(v => v.topic.toLowerCase() === topic.toLowerCase());
  if (pool.length === 0) return null;

  const recent = recentByTopic[topic] || [];
  const candidates = pool.filter(v => !recent.includes(v.reference));

  const chosen = (candidates.length > 0 ? candidates : pool)[Math.floor(Math.random() * (candidates.length > 0 ? candidates : pool).length)];

  // Update rotation memory
  const nextRecent = [chosen.reference, ...recent].slice(0, maxRecent);
  recentByTopic[topic] = nextRecent;

  return chosen;
}
