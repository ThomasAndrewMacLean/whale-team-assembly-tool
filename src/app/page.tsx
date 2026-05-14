import { fetchAllCharacters } from "@/api";
import CharacterGrid from "@/components/CharacterGrid";
import styles from "./page.module.css";

export default async function HomePage() {
  const characters = await fetchAllCharacters();

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Assemble Your Team</h1>
      <CharacterGrid characters={characters} />
    </main>
  );
}
