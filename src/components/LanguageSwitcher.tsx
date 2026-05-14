"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { LOCALES, type Locale } from "@/i18n/config";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "Galactic Basic",
  huttese: "Huttese",
  mandoa: "Mando'a",
};

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = params.lang as Locale;

  function switchLocale(newLocale: Locale) {
    // Set a cookie so the middleware can redirect bare URLs to the right locale
    document.cookie = `sw-locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    const newPath = pathname.replace(`/${currentLang}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <Box sx={{ display: "flex", gap: 0.75 }}>
      {LOCALES.map((locale) => (
        <Button
          key={locale}
          size="small"
          variant={locale === currentLang ? "contained" : "text"}
          onClick={() => switchLocale(locale)}
          sx={{
            fontSize: "0.7rem",
            minWidth: "auto",
            px: 1.25,
            py: 0.5,
            ...(locale !== currentLang && {
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }),
          }}
        >
          {LOCALE_LABELS[locale]}
        </Button>
      ))}
    </Box>
  );
}
