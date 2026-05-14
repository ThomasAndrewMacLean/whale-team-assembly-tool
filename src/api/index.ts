import type { Character } from "@/types";

export async function fetchAllCharacters(): Promise<Character[]> {
  const res = await fetch(
    "https://akabab.github.io/starwars-api/api/all.json",
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Star Wars characters: ${res.status}`);
  }
  return res.json();
}
