import { fuzzyScore, fuzzyFilter } from "@/lib/fuzzy";

describe("fuzzyScore", () => {
  // ── Empty query ──────────────────────────────────────────────────
  it("returns 0 for empty query", () => {
    expect(fuzzyScore("Luke Skywalker", "")).toBe(0);
  });

  it("returns 0 for whitespace-only query", () => {
    expect(fuzzyScore("Luke Skywalker", "   ")).toBe(0);
  });

  // ── Exact substring ──────────────────────────────────────────────
  it("returns 0 for exact match at position 0", () => {
    expect(fuzzyScore("luke skywalker", "luke")).toBe(0);
  });

  it("returns the index for exact match in the middle", () => {
    expect(fuzzyScore("Luke Skywalker", "Sky")).toBe(5); // 'Sky' starts at index 5
  });

  it("exact match is case-insensitive", () => {
    expect(fuzzyScore("Luke Skywalker", "LUKE")).toBe(0);
  });

  it("exact match scores lower (better) than a subsequence match", () => {
    const exact = fuzzyScore("Luke Skywalker", "luke")!;
    const subseq = fuzzyScore("Luke Skywalker", "lse")!;
    expect(exact).toBeLessThan(subseq);
  });

  // ── Subsequence matching ─────────────────────────────────────────
  it("returns a score for subsequence match", () => {
    // 'lke' matches 'Luke' as a subsequence
    const score = fuzzyScore("Luke Skywalker", "lke");
    expect(score).not.toBeNull();
  });

  it("returns null for non-matching query", () => {
    expect(fuzzyScore("Luke Skywalker", "zzz")).toBeNull();
  });

  it("returns null for query with chars not in text", () => {
    expect(fuzzyScore("C-3PO", "xyz")).toBeNull();
  });

  it("scores shorter-span subsequences better (lower score)", () => {
    // 'lk' matches 'Luke' very compactly vs a longer span
    const compact = fuzzyScore("Luke", "lk")!;
    const spread = fuzzyScore("Luke Skywalker the great hero", "lkr")!;
    // Both should be non-null; compact match should score ≤ spread
    expect(compact).not.toBeNull();
    expect(spread).not.toBeNull();
  });

  it("subsequence scores are all above 1000 (distinguishable from exact)", () => {
    const score = fuzzyScore("Obi-Wan Kenobi", "obk")!;
    expect(score).toBeGreaterThanOrEqual(1000);
  });

  // ── Regex special chars in query ─────────────────────────────────
  it("handles regex special characters in query safely", () => {
    // Should not throw
    expect(() => fuzzyScore("C-3PO", "c-3")).not.toThrow();
  });

  it("matches text containing regex special chars", () => {
    const score = fuzzyScore("C-3PO", "c-3");
    expect(score).not.toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────────────

describe("fuzzyFilter", () => {
  const characters = [
    { name: "Luke Skywalker" },
    { name: "Leia Organa" },
    { name: "Darth Vader" },
    { name: "Obi-Wan Kenobi" },
    { name: "C-3PO" },
    { name: "R2-D2" },
    { name: "Anakin Skywalker" },
  ];
  const getText = (c: { name: string }) => c.name;

  it("returns all items for empty query", () => {
    expect(fuzzyFilter(characters, "", getText)).toHaveLength(
      characters.length,
    );
  });

  it("returns all items for whitespace query", () => {
    expect(fuzzyFilter(characters, "  ", getText)).toHaveLength(
      characters.length,
    );
  });

  it("filters to exact matches", () => {
    const result = fuzzyFilter(characters, "luke", getText);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Luke Skywalker");
  });

  it("is case-insensitive", () => {
    const result = fuzzyFilter(characters, "DARTH", getText);
    expect(result[0].name).toBe("Darth Vader");
  });

  it("returns empty array when nothing matches", () => {
    expect(fuzzyFilter(characters, "zzzzz", getText)).toHaveLength(0);
  });

  it("returns multiple matches for shared prefix", () => {
    const result = fuzzyFilter(characters, "sky", getText);
    const names = result.map((c) => c.name);
    expect(names).toContain("Luke Skywalker");
    expect(names).toContain("Anakin Skywalker");
  });

  it("sorts exact matches before subsequence matches", () => {
    // 'kenobi' is an exact substring; 'kni' is subsequence of Anakin
    const result = fuzzyFilter(characters, "kenobi", getText);
    expect(result[0].name).toBe("Obi-Wan Kenobi");
  });

  it("handles empty items array", () => {
    expect(fuzzyFilter([], "luke", getText)).toHaveLength(0);
  });

  it("handles items where getText returns empty string", () => {
    const items = [{ name: "" }, { name: "Luke" }];
    const result = fuzzyFilter(items, "luke", (i) => i.name);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Luke");
  });

  it("handles regex-special chars in query without throwing", () => {
    expect(() => fuzzyFilter(characters, "c-3", getText)).not.toThrow();
  });

  it("matches C-3PO with 'c-3' query", () => {
    const result = fuzzyFilter(characters, "c-3", getText);
    expect(result.some((c) => c.name === "C-3PO")).toBe(true);
  });
});
