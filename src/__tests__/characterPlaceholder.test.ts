import { generateCharacterPlaceholder } from "@/lib/characterPlaceholder";

describe("generateCharacterPlaceholder", () => {
  it("returns a string", () => {
    expect(typeof generateCharacterPlaceholder("Luke Skywalker")).toBe(
      "string",
    );
  });

  it("returns a data URI", () => {
    const result = generateCharacterPlaceholder("Luke Skywalker");
    expect(result).toMatch(/^data:image\/svg\+xml/);
  });

  it("is deterministic — same name always produces same output", () => {
    const a = generateCharacterPlaceholder("Darth Vader");
    const b = generateCharacterPlaceholder("Darth Vader");
    expect(a).toBe(b);
  });

  it("different names produce different outputs", () => {
    const a = generateCharacterPlaceholder("Luke Skywalker");
    const b = generateCharacterPlaceholder("Leia Organa");
    expect(a).not.toBe(b);
  });

  it("includes an SVG root element", () => {
    const result = generateCharacterPlaceholder("Yoda");
    const decoded = decodeURIComponent(result.split(",").slice(1).join(","));
    expect(decoded).toContain("<svg");
  });

  it("includes the character initials in the SVG", () => {
    const result = generateCharacterPlaceholder("Luke Skywalker");
    const decoded = decodeURIComponent(result.split(",").slice(1).join(","));
    expect(decoded).toContain("LS");
  });

  it("handles single-word name (one initial)", () => {
    const result = generateCharacterPlaceholder("Yoda");
    const decoded = decodeURIComponent(result.split(",").slice(1).join(","));
    expect(decoded).toContain("Y");
  });

  it("handles empty string without throwing", () => {
    expect(() => generateCharacterPlaceholder("")).not.toThrow();
  });

  it("handles names with extra spaces", () => {
    expect(() => generateCharacterPlaceholder("Obi-Wan  Kenobi")).not.toThrow();
  });

  it("handles very long names", () => {
    const longName = "A".repeat(1000);
    expect(() => generateCharacterPlaceholder(longName)).not.toThrow();
  });

  it("produces different images for names that differ only by case", () => {
    // nameToSeed is case-sensitive via charCodeAt
    const lower = generateCharacterPlaceholder("luke");
    const upper = generateCharacterPlaceholder("LUKE");
    expect(lower).not.toBe(upper);
  });
});
