import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import StoreProvider from "@/store/StoreProvider";
import TeamPanel from "@/components/TeamPanel";
import ThemeRegistry from "@/theme/ThemeRegistry";
import DictionaryProvider from "@/components/DictionaryProvider";
import HeaderControls from "@/components/HeaderControls";
import { getDictionary, hasLocale } from "@/i18n/getDictionary";
import { LOCALES, type Locale } from "@/i18n/config";
import "../globals.css";

export const metadata: Metadata = {
  title: "Star Wars Team Assembly",
  description: "Assemble your Star Wars team — may the Force be with you.",
  icons: { icon: "/favicon.svg" },
};

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang}>
      <body>
        <ThemeRegistry>
          <StoreProvider>
            <DictionaryProvider dict={dict}>
              {/* Skip-to-content link — visible on focus for keyboard users */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>

              <Box
                component="header"
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1,
                  bgcolor: "background.default",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Image
                    src="/logo.svg"
                    alt=""
                    width={28}
                    height={28}
                    priority
                  />
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: "primary.main",
                      lineHeight: 1,
                    }}
                  >
                    Squad Assembler
                  </Typography>
                </Box>
                <HeaderControls />
              </Box>
              <Divider />
              <Box id="main-content" component="main">
                {children}
              </Box>
              <TeamPanel />
            </DictionaryProvider>
          </StoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
