import { fetchAllCharacters } from "@/api";
import CharacterDetail from "@/components/CharacterDetail";
import { notFound } from "next/navigation";
import { LOCALES } from "@/i18n/config";

export async function generateStaticParams() {
  const characters = await fetchAllCharacters();
  return LOCALES.flatMap((lang) =>
    characters.map((c) => ({ lang, id: String(c.id) }))
  );
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = await params;
  const characters = await fetchAllCharacters();
  const index = characters.findIndex((c) => c.id === Number(id));

  if (index === -1) notFound();

  const character = characters[index];
  const prevId = index > 0 ? characters[index - 1].id : null;
  const nextId =
    index < characters.length - 1 ? characters[index + 1].id : null;

  return (
    <CharacterDetail character={character} prevId={prevId} nextId={nextId} />
  );
}
