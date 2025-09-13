import { z } from "zod";

/** /dhll/seed/summary */
export const SeedSummary = z.object({
  ok: z.boolean().default(true).optional(),
  emotion_count: z.number(),
  verse_count: z.number(),
  weights: z.record(z.string(), z.number()).optional(),
});
export type TSeedSummary = z.infer<typeof SeedSummary>;

/** /dhll/map */
export const MapRequest = z.object({
  emotion: z.string().min(1),
  language: z.string().default("en").optional(),
});
export type TMapRequest = z.infer<typeof MapRequest>;

export const ScriptureCandidate = z.object({
  ref: z.string(),      // e.g., "Philippians 4:6-7"
  text: z.string().optional(), // may be omitted per translation policy
  score: z.number().optional(),
});
export const MapResponse = z.object({
  emotion: z.string(),
  themes: z.array(z.string()).optional(),
  candidates: z.array(ScriptureCandidate).default([]),
});
export type TMapResponse = z.infer<typeof MapResponse>;

/** /dhll/compose */
export const ComposeRequest = z.object({
  emotion: z.string().min(1),
  language: z.string().default("en").optional(),

  // Pronouns & person context (existing)
  pronoun_style: z.enum(["i", "we", "he", "she", "they"]).default("we").optional(),
  person_name: z.string().optional(),

  // NEW: Toggle whether we inject the name at all (defaults to true)
  name_injection: z.boolean().default(true).optional(),

  // Situation text provided by the user
  situation: z.string().optional(),

  // NEW: Tone pack selector for vocabulary/flow
  tone_variant: z.enum(["gentle", "bold", "comfort", "hope"]).optional(),

  // NEW: Scripture variety rotation
  verse_rotation: z
    .object({
      seed: z.string().optional(),
      avoid: z.array(z.string()).optional(), // recently used verse IDs
    })
    .optional(),

  show_anchor: z.boolean().optional(),
});
export type TComposeRequest = z.infer<typeof ComposeRequest>;

export const PrayerSection = z.object({
  title: z.string(),    // "Adoration", "Confession", ...
  content: z.string(),  // section text
});
export const ComposeResponse = z.object({
  sections: z.array(PrayerSection),
  anchor: z
    .object({
      ref: z.string(),
      text: z.string().optional(), // may be reference-only
    })
    .optional(),
  meta: z
    .object({
      emotion: z.string().optional(),
      timing_ms: z.number().optional(),
      request_id: z.string().optional(),
    })
    .optional(),
});
export type TComposeResponse = z.infer<typeof ComposeResponse>;
