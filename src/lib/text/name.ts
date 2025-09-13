// src/lib/text/name.ts
export interface NameRules {
  enabled: boolean;        // gate via name_injection
  personName?: string;     // raw name from request
}

export interface NamePlan {
  opening: string | null;  // opening clause using name once
  possessive: string[];    // up to 2 possessive callbacks later
}

export function planNameUsage(rules: NameRules): NamePlan {
  if (!rules.enabled || !rules.personName) {
    return { opening: null, possessive: [] };
  }
  const name = rules.personName.trim();
  if (!name) return { opening: null, possessive: [] };

  // Opening: “we lift up John today” / “I lift up John today”
  const opening = `lift up ${name} today`;

  // Possessive fragments to sprinkle later (max 2)
  const poss = [
    `strengthen ${name}'s heart`,
    `guide ${name}'s steps`,
  ];

  return { opening, possessive: poss.slice(0, 2) };
}

/**
 * Utility to insert an opening clause after a salutation.
 * Example:
 *   input:  "Father, we come before You..."
 *   clause: "lift up John today"
 *   → "Father, we lift up John today; we come before You..."
 */
export function insertOpeningClause(text: string, clause: string | null): string {
  if (!clause) return text;
  const trimmed = text.trim();
  const idx = trimmed.indexOf(",");
  if (idx > -1 && idx < 40) {
    const head = trimmed.slice(0, idx + 1); // include comma
    const tail = trimmed.slice(idx + 1).trimStart();
    return `${head} we ${clause}; ${tail}`;
  }
  // fallback: prefix
  return `We ${clause}. ${trimmed}`;
}
