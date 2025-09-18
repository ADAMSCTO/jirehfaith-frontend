// src/lib/verses.ts
// Helpers for selecting scripture verses by topic.
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
  getAllVerses().forEach((v) => set.add(v.topic));
  return Array.from(set).sort();
}

export function getRandomVerseByTopic(topic: string): Verse | null {
  const pool = getAllVerses().filter(
    (v) => v.topic.toLowerCase() === topic.toLowerCase()
  );
  if (pool.length === 0) return null;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// Basic rotation memory (in-memory per session, resets on reload)
const recentByTopic: Record<string, string[]> = {};

/**
 * Returns the next verse for a topic without repeating until all verses
 * in that topic have been shown. Rotation resets once pool is exhausted.
 */
export function getNextNonRepeatingVerse(topic: string): Verse | null {
  const pool = getAllVerses().filter(
    (v) => v.topic.toLowerCase() === topic.toLowerCase()
  );
  if (pool.length === 0) return null;

  const recent = recentByTopic[topic] || [];
  const candidates = pool.filter((v) => !recent.includes(v.reference));

  const chosenPool = candidates.length > 0 ? candidates : pool;
  const chosen = chosenPool[Math.floor(Math.random() * chosenPool.length)];

  // Keep rotation memory equal to pool size so no repeats until cycle completes
  const cap = Math.max(1, pool.length);
  const nextRecent = [chosen.reference, ...recent].slice(0, cap);
  recentByTopic[topic] = nextRecent;

  return chosen;
}
