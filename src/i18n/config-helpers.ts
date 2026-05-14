import type { Locale } from "./config";
import { LOCALES } from "./config";

export const hasLocale = (locale: string): locale is Locale =>
  LOCALES.includes(locale as Locale);
