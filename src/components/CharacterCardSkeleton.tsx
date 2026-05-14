import styles from "./CharacterCardSkeleton.module.css";

export default function CharacterCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageWrapper} />
      <div className={styles.info}>
        <div className={styles.nameLine} />
        <div className={styles.subLine} />
      </div>
    </div>
  );
}
