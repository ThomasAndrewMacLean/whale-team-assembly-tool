"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import TeamMemberCard from "@/components/TeamMemberCard";
import styles from "./page.module.css";

export default function TeamPage() {
  const team = useAppSelector((state) => state.team.members);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← All Characters
        </Link>
        <h1 className={styles.heading}>Your Team ({team.length}/5)</h1>
      </div>

      {team.length === 0 ? (
        <div className={styles.empty}>
          <p>Your team is empty.</p>
          <Link href="/" className={styles.browseLink}>
            Browse characters →
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {team.map((member) => (
            <TeamMemberCard key={member.id} character={member} />
          ))}
        </div>
      )}
    </main>
  );
}
