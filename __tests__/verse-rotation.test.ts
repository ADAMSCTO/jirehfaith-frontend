// __tests__/verse-rotation.test.ts
import { describe, test, expect } from "vitest";
import { selectVerse, getVersePool } from "../src/lib/text/verses";
import { ToneVariant } from "../src/lib/text/tone";

describe("Verse Rotation Logic", () => {
  test("selects a verse from the correct tone pool", () => {
    const tone: ToneVariant = "hope";
    const verse = selectVerse({ tone });
    const pool = getVersePool(tone);
    expect(pool).toContainEqual(expect.objectContaining({ id: verse.id }));
  });

  test("avoids recently used verses", () => {
    const tone: ToneVariant = "comfort";
    const recentVerses = ["ps23_1-3", "mt11_28-30"];
    const verse = selectVerse({ tone, avoid: recentVerses });

    expect(recentVerses).not.toContain(verse.id);
  });

  test("picks verse deterministically based on seed", () => {
    const tone: ToneVariant = "grief";
    const seed = "12345";
    const verse1 = selectVerse({ tone, seed });
    const verse2 = selectVerse({ tone, seed });
    expect(verse1.id).toBe(verse2.id);  // Should be the same verse on repeated calls with the same seed
  });

  test("handles empty verse pool gracefully", () => {
    const tone: ToneVariant = "nonexistent_tone" as ToneVariant;
    const verse = selectVerse({ tone });
    expect(verse).toBeDefined(); // Ensure it doesn't fail
  });
});
