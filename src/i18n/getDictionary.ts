import type { Dictionary, Locale } from "./config";
export { hasLocale } from "./config-helpers";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import("./dictionaries/en.json").then((m) => m.default as Dictionary),
  huttese: () =>
    import("./dictionaries/huttese.json").then((m) => m.default as Dictionary),
  mandoa: () =>
    import("./dictionaries/mandoa.json").then((m) => m.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  loaders[locale]();
