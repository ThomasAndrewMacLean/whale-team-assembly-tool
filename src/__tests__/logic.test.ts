import { isEvilCharacter } from "@/logic";
import type { Character } from "@/types";

const base: Character = {
  id: 1,
  name: "Luke Skywalker",
  gender: "male",
  wiki: "",
  image: "",
  species: "Human",
  eyeColor: "blue",
  skinColor: "fair",
  affiliations: [],
  formerAffiliations: [],
};

function make(overrides: Partial<Character>): Character {
  return { ...base, ...overrides };
}

describe("isEvilCharacter", () => {
  // ── "Darth" in name ──────────────────────────────────────────────
  it("returns true when name contains 'Darth'", () => {
    expect(isEvilCharacter(make({ name: "Darth Vader" }))).toBe(true);
  });

  it("returns true when name contains 'darth' (case-insensitive)", () => {
    expect(isEvilCharacter(make({ name: "darth maul" }))).toBe(true);
  });

  it("returns true when name contains 'DARTH' uppercase", () => {
    expect(isEvilCharacter(make({ name: "DARTH SIDIOUS" }))).toBe(true);
  });

  // ── "Sith" in name ───────────────────────────────────────────────
  it("returns true when name contains 'Sith'", () => {
    expect(isEvilCharacter(make({ name: "Sith Acolyte" }))).toBe(true);
  });

  // ── Affiliations ─────────────────────────────────────────────────
  it("returns true when affiliation contains 'Darth'", () => {
    expect(
      isEvilCharacter(make({ affiliations: ["Order of Darth Bane"] })),
    ).toBe(true);
  });

  it("returns true when affiliation contains 'Sith'", () => {
    expect(isEvilCharacter(make({ affiliations: ["Sith Empire"] }))).toBe(true);
  });

  it("checks all affiliations — matches second element", () => {
    expect(
      isEvilCharacter(make({ affiliations: ["Rebel Alliance", "Sith Cult"] })),
    ).toBe(true);
  });

  // ── Masters ──────────────────────────────────────────────────────
  it("returns true when master name contains 'Darth' (string form)", () => {
    expect(isEvilCharacter(make({ masters: "Darth Sidious" }))).toBe(true);
  });

  it("returns true when a master in array contains 'Darth'", () => {
    expect(isEvilCharacter(make({ masters: ["Yoda", "Darth Plagueis"] }))).toBe(
      true,
    );
  });

  it("returns false when master is not evil", () => {
    expect(isEvilCharacter(make({ masters: "Obi-Wan Kenobi" }))).toBe(false);
  });

  // ── Good characters ──────────────────────────────────────────────
  it("returns false for Luke Skywalker", () => {
    expect(isEvilCharacter(make({}))).toBe(false);
  });

  it("returns false for character with no affiliations or masters", () => {
    expect(
      isEvilCharacter(make({ name: "Jar Jar Binks", affiliations: [] })),
    ).toBe(false);
  });

  it("returns false for character with empty masters array", () => {
    expect(isEvilCharacter(make({ masters: [] }))).toBe(false);
  });

  it("returns false when name just contains 'art' (partial match doesn't trigger)", () => {
    expect(isEvilCharacter(make({ name: "Artoo" }))).toBe(false);
  });

  // ── Edge cases ───────────────────────────────────────────────────
  it("returns false for character with undefined masters", () => {
    expect(isEvilCharacter(make({ masters: undefined }))).toBe(false);
  });

  it("handles a single-element masters array", () => {
    expect(isEvilCharacter(make({ masters: ["Darth Tyranus"] }))).toBe(true);
  });

  it("returns false when affiliation is empty string", () => {
    expect(isEvilCharacter(make({ affiliations: [""] }))).toBe(false);
  });

  // ── Anakin / Vader edge case ─────────────────────────────────────
  it("marks Anakin Skywalker as evil via Darth master", () => {
    const anakin = make({
      name: "Anakin Skywalker",
      masters: ["Obi-Wan Kenobi", "Darth Sidious"],
    });
    expect(isEvilCharacter(anakin)).toBe(true);
  });

  it("marks Anakin Skywalker as NOT evil if no evil links at all", () => {
    const anakin = make({
      name: "Anakin Skywalker",
      affiliations: ["Jedi Order"],
      masters: ["Obi-Wan Kenobi"],
    });
    expect(isEvilCharacter(anakin)).toBe(false);
  });
});
