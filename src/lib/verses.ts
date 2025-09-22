// src/lib/verses.ts
// Helpers for selecting scripture verses by topic.
// Using WEB (World English Bible) translation — public domain.

import verses from "@/data/verses.json";

export type Verse = {
  topic: string;
  reference: string;
  version: string;
  text: string;
};

export type Topic = string;

/**
 * EXTRA VERSES (appended at runtime).
 * Topic: "Suffering and Despair" — 7 verses (WEB).
 */
const EXTRA_VERSES: Verse[] = [
  {
    topic: "Suffering and Despair",
    reference: "Psalm 34:18",
    version: "WEB",
    text:
      "Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.",
  },
  {
    topic: "Suffering and Despair",
    reference: "Romans 8:18",
    version: "WEB",
    text:
      "For I consider that the sufferings of this present time are not worthy to be compared with the glory which will be revealed toward us.",
  },
  {
    topic: "Suffering and Despair",
    reference: "2 Corinthians 4:8-9",
    version: "WEB",
    text:
      "We are pressed on every side, yet not crushed; perplexed, yet not to despair; pursued, yet not forsaken; struck down, yet not destroyed;",
  },
  {
    topic: "Suffering and Despair",
    reference: "Psalm 42:11",
    version: "WEB",
    text:
      "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, my salvation and my God.",
  },
  {
    topic: "Suffering and Despair",
    reference: "1 Peter 5:10",
    version: "WEB",
    text:
      "But may the God of all grace, who called you to his eternal glory by Christ Jesus, after you have suffered a little while, perfect, establish, strengthen, and settle you.",
  },
  {
    topic: "Suffering and Despair",
    reference: "Isaiah 41:10",
    version: "WEB",
    text:
      "Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.",
  },
  {
    topic: "Suffering and Despair",
    reference: "Psalm 23:4",
    version: "WEB",
    text:
      "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.",
  },
];

/**
 * Merge JSON verses with any extra verses defined above.
 */
function mergedVerses(): Verse[] {
  const base = (verses as Verse[]) || [];
  const out: Verse[] = [...base];

  const seen = new Set(base.map((v) => `${v.topic.toLowerCase()}|${v.reference.toLowerCase()}`));
  for (const v of EXTRA_VERSES) {
    const key = `${v.topic.toLowerCase()}|${v.reference.toLowerCase()}`;
    if (!seen.has(key)) {
      out.push(v);
      seen.add(key);
    }
  }
  return out;
}

export function getAllVerses(): Verse[] {
  return mergedVerses();
}

export function getTopics(): Topic[] {
  const set = new Set<string>();
  getAllVerses().forEach((v) => set.add(v.topic));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getRandomVerseByTopic(topic: string): Verse | null {
  const pool = getAllVerses().filter(
    (v) => v.topic.toLowerCase() === String(topic).toLowerCase()
  );
  if (pool.length === 0) return null;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// Basic rotation memory (in-memory per session, resets on reload)
const recentByTopic: Record<string, string[]> = {};

/**
 * Returns the next verse for a topic without repeating until all verses
 * in that topic have been shown.
 */
export function getNextNonRepeatingVerse(topic: string): Verse | null {
  const pool = getAllVerses().filter(
    (v) => v.topic.toLowerCase() === String(topic).toLowerCase()
  );
  if (pool.length === 0) return null;

  const key = String(topic);
  const recent = recentByTopic[key] || [];
  const candidates = pool.filter((v) => !recent.includes(v.reference));

  const chosenPool = candidates.length > 0 ? candidates : pool;
  const chosen = chosenPool[Math.floor(Math.random() * chosenPool.length)];

  // Keep memory equal to pool size so no repeats until cycle completes
  const cap = Math.max(1, pool.length);
  recentByTopic[key] = [chosen.reference, ...recent].slice(0, cap);

  return chosen;
}
