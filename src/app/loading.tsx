import CharacterGridSkeleton from "@/components/CharacterGridSkeleton";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Assemble Your Team</h1>
      <CharacterGridSkeleton count={24} />
    </main>
  );
}
