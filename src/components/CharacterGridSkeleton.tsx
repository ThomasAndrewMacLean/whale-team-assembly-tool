import CharacterCardSkeleton from "./CharacterCardSkeleton";
import styles from "./CharacterGrid.module.css";

interface Props {
  count?: number;
}

export default function CharacterGridSkeleton({ count = 20 }: Props) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </div>
  );
}
