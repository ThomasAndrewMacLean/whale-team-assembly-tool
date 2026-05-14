import { hasLocale } from "@/i18n/config-helpers";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/config";

describe("i18n/config", () => {
  it("exports the three expected locales", () => {
    expect(LOCALES).toEqual(
      expect.arrayContaining(["en", "huttese", "mandoa"]),
    );
    expect(LOCALES).toHaveLength(3);
  });

  it("DEFAULT_LOCALE is 'en'", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });
});

describe("hasLocale", () => {
  it("returns true for 'en'", () => {
    expect(hasLocale("en")).toBe(true);
  });

  it("returns true for 'huttese'", () => {
    expect(hasLocale("huttese")).toBe(true);
  });

  it("returns true for 'mandoa'", () => {
    expect(hasLocale("mandoa")).toBe(true);
  });

  it("returns false for an unknown locale", () => {
    expect(hasLocale("fr")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(hasLocale("")).toBe(false);
  });

  it("returns false for 'EN' (case-sensitive)", () => {
    expect(hasLocale("EN")).toBe(false);
  });

  it("returns false for a locale with trailing space", () => {
    expect(hasLocale("en ")).toBe(false);
  });

  it("returns false for undefined cast to string", () => {
    expect(hasLocale("undefined")).toBe(false);
  });
});
