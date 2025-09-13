// src/lib/text/grammar.ts
// Grammar helper for pronouns and verb conjugation

export type PronounStyle = "i" | "we" | "he" | "she" | "they";

const pronounPacks: Record<
  PronounStyle,
  {
    subject: string;
    object: string;
    possessiveAdj: string;
    possessiveNoun: string;
    reflexive: string;
  }
> = {
  i: {
    subject: "I",
    object: "me",
    possessiveAdj: "my",
    possessiveNoun: "mine",
    reflexive: "myself",
  },
  we: {
    subject: "we",
    object: "us",
    possessiveAdj: "our",
    possessiveNoun: "ours",
    reflexive: "ourselves",
  },
  he: {
    subject: "he",
    object: "him",
    possessiveAdj: "his",
    possessiveNoun: "his",
    reflexive: "himself",
  },
  she: {
    subject: "she",
    object: "her",
    possessiveAdj: "her",
    possessiveNoun: "hers",
    reflexive: "herself",
  },
  they: {
    subject: "they",
    object: "them",
    possessiveAdj: "their",
    possessiveNoun: "theirs",
    reflexive: "themselves",
  },
};

export function pronouns(style: PronounStyle) {
  return pronounPacks[style];
}

// Verb conjugation helpers
export function conjugateBe(style: PronounStyle) {
  switch (style) {
    case "i":
      return "am";
    case "we":
    case "they":
      return "are";
    case "he":
    case "she":
      return "is";
  }
}

export function conjugateHave(style: PronounStyle) {
  switch (style) {
    case "he":
    case "she":
      return "has";
    default:
      return "have";
  }
}

export function conjugatePresent(verb: string, style: PronounStyle) {
  if (style === "he" || style === "she") {
    if (verb.endsWith("y")) {
      return verb.slice(0, -1) + "ies"; // e.g., "carry" → "carries"
    }
    if (verb.endsWith("s") || verb.endsWith("sh") || verb.endsWith("ch") || verb.endsWith("x") || verb.endsWith("z")) {
      return verb + "es"; // e.g., "watch" → "watches"
    }
    return verb + "s"; // generic add -s
  }
  return verb;
}

export function isThirdPerson(style: PronounStyle) {
  return style === "he" || style === "she";
}
