// __tests__/grammar.test.ts
import { describe, test, expect } from "vitest";
import {
  pronouns,
  conjugateBe,
  conjugateHave,
  conjugatePresent,
  isThirdPerson,
} from "../src/lib/text/grammar";

describe("pronoun packs", () => {
  test("I pack", () => {
    const p = pronouns("i");
    expect(p.subject).toBe("I");
    expect(p.object).toBe("me");
    expect(p.possessiveAdj).toBe("my");
    expect(p.possessiveNoun).toBe("mine");
    expect(p.reflexive).toBe("myself");
  });

  test("they pack", () => {
    const p = pronouns("they");
    expect(p.subject).toBe("they");
    expect(p.object).toBe("them");
    expect(p.possessiveAdj).toBe("their");
    expect(p.possessiveNoun).toBe("theirs");
    expect(p.reflexive).toBe("themselves");
  });
});

describe("verb: be", () => {
  test("conjugateBe matches subject", () => {
    expect(conjugateBe("i")).toBe("am");
    expect(conjugateBe("we")).toBe("are");
    expect(conjugateBe("they")).toBe("are");
    expect(conjugateBe("he")).toBe("is");
    expect(conjugateBe("she")).toBe("is");
  });
});

describe("verb: have", () => {
  test("he/she → has; others → have", () => {
    expect(conjugateHave("he")).toBe("has");
    expect(conjugateHave("she")).toBe("has");
    expect(conjugateHave("i")).toBe("have");
    expect(conjugateHave("we")).toBe("have");
    expect(conjugateHave("they")).toBe("have");
  });
});

describe("generic present", () => {
  test("adds -s for he/she", () => {
    expect(conjugatePresent("walk", "he")).toBe("walks");
    expect(conjugatePresent("walk", "she")).toBe("walks");
    expect(conjugatePresent("walk", "we")).toBe("walk");
  });

  test("handles -y → -ies", () => {
    expect(conjugatePresent("carry", "he")).toBe("carries");
    expect(conjugatePresent("carry", "she")).toBe("carries");
    expect(conjugatePresent("carry", "they")).toBe("carry");
  });

  test("adds -es for s/sh/ch/x/z endings", () => {
    expect(conjugatePresent("watch", "he")).toBe("watches");
    expect(conjugatePresent("watch", "she")).toBe("watches");
    expect(conjugatePresent("fix", "he")).toBe("fixes");
    expect(conjugatePresent("buzz", "he")).toBe("buzzes");
  });
});

describe("person helpers", () => {
  test("isThirdPerson", () => {
    expect(isThirdPerson("he")).toBe(true);
    expect(isThirdPerson("she")).toBe(true);
    expect(isThirdPerson("they")).toBe(false);
    expect(isThirdPerson("i")).toBe(false);
    expect(isThirdPerson("we")).toBe(false);
  });
});
