/**
 * Lightweight fuzzy match — no dependencies.
 *
 * Strategy:
 *  1. Exact substring → highest score
 *  2. Subsequence regex (all typed chars appear in order, gaps allowed) → ranked by compactness
 *
 * Returns `null` if no match, or a score (lower = better) for sorting.
 */
export function fuzzyScore(text: string, query: string): number | null {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  // Exact substring — best score
  const exactIdx = t.indexOf(q);
  if (exactIdx !== -1) return exactIdx; // earlier in string = better

  // Subsequence match: "lke" matches "Luke", "leia", etc.
  // Build regex: l.*u.*k.*e
  const escaped = [...q].map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(escaped.join(".*"), "i");
  const m = t.match(pattern);
  if (!m || m.index == null) return null;

  // Score by match length (shorter span = more compact = better) + position
  return 1000 + m[0].length * 10 + m.index;
}

export function fuzzyFilter<T>(
  items: T[],
  query: string,
  getText: (item: T) => string
): T[] {
  if (!query.trim()) return items;

  const scored = items.flatMap((item) => {
    const score = fuzzyScore(getText(item), query);
    return score === null ? [] : [{ item, score }];
  });

  scored.sort((a, b) => a.score - b.score);
  return scored.map((s) => s.item);
}
