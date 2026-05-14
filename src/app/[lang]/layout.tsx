import { notFound } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TeamPanel from "@/components/TeamPanel";
import DictionaryProvider from "@/components/DictionaryProvider";
import HeaderControls from "@/components/HeaderControls";
import { getDictionary, hasLocale } from "@/i18n/getDictionary";
import { LOCALES, type Locale } from "@/i18n/config";

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
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
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
  );
}
