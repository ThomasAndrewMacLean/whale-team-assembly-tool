import { fetchAllCharacters } from "@/api";
import CharacterDetail from "@/components/CharacterDetail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: Props) {
  const { id } = await params;
  const characters = await fetchAllCharacters();
  const index = characters.findIndex((c) => c.id === Number(id));

  if (index === -1) notFound();

  const character = characters[index];
  const prevId = index > 0 ? characters[index - 1].id : null;
  const nextId = index < characters.length - 1 ? characters[index + 1].id : null;

  return (
    <CharacterDetail character={character} prevId={prevId} nextId={nextId} />
  );
}
