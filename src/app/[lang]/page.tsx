import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { fetchAllCharacters } from "@/api";
import CharacterGrid from "@/components/CharacterGrid";
import { getDictionary, hasLocale } from "@/i18n/getDictionary";
import { LOCALES, type Locale } from "@/i18n/config";

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [characters, dict] = await Promise.all([
    fetchAllCharacters(),
    getDictionary(lang as Locale),
  ]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {dict.home.heading}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {dict.home.subtitle}
        </Typography>
      </Box>
      <CharacterGrid characters={characters} />
    </Container>
  );
}
