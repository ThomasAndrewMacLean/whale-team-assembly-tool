import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;
export type Locale = "en" | "huttese" | "mandoa";
export const LOCALES: Locale[] = ["en", "huttese", "mandoa"];
export const DEFAULT_LOCALE: Locale = "en";
