"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMember, removeMember } from "@/store/teamSlice";
import { isEvilCharacter } from "@/logic";
import type { Character } from "@/types";
import styles from "./CharacterDetail.module.css";

interface Props {
  character: Character;
  prevId: number | null;
  nextId: number | null;
}

export default function CharacterDetail({ character, prevId, nextId }: Props) {
  const dispatch = useAppDispatch();
  const team = useAppSelector((state) => state.team.members);
  const router = useRouter();

  const isInTeam = team.some((m) => m.id === character.id);
  const isEvil = isEvilCharacter(character);
  const teamFull = team.length >= 5;

  const stats: { label: string; value: string | number }[] = [
    ...(character.height
      ? [{ label: "Height", value: `${character.height} m` }]
      : []),
    ...(character.mass
      ? [{ label: "Mass", value: `${character.mass} kg` }]
      : []),
    ...(character.species
      ? [{ label: "Species", value: character.species }]
      : []),
    ...(character.gender ? [{ label: "Gender", value: character.gender }] : []),
    ...(character.homeworld && !Array.isArray(character.homeworld)
      ? [{ label: "Homeworld", value: character.homeworld }]
      : []),
  ];

  return (
    <main className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← All Characters
      </button>

      <div className={styles.layout}>
        <ViewTransition name={`character-image-${character.id}`} share="morph">
          <div className={styles.imageWrapper}>
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className={styles.image}
              priority
            />
          </div>
        </ViewTransition>

        <div className={styles.info}>
          <div>
            <h1 className={styles.name}>{character.name}</h1>
            {isEvil && <div className={styles.evilBadge}>⚡ Dark Side</div>}
          </div>

          <div className={styles.stats}>
            {stats.map(({ label, value }) => (
              <div key={label} className={styles.statRow}>
                <span className={styles.statLabel}>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {character.affiliations.length > 0 && (
            <div className={styles.affiliations}>
              <h3>Affiliations</h3>
              <ul className={styles.affiliationsList}>
                {character.affiliations.map((aff) => (
                  <li key={aff}>{aff}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.actions}>
            {isEvil ? (
              <button className={styles.evilButton} disabled>
                Too evil for the team
              </button>
            ) : isInTeam ? (
              <button
                className={styles.removeButton}
                onClick={() => dispatch(removeMember(character.id))}
              >
                Remove from Team
              </button>
            ) : (
              <button
                className={styles.addButton}
                onClick={() => dispatch(addMember(character))}
                disabled={teamFull}
              >
                {teamFull ? "Team is Full (5/5)" : "Add to Team"}
              </button>
            )}
          </div>

          <div className={styles.navigation}>
            {prevId ? (
              <Link href={`/characters/${prevId}`} className={styles.navButton}>
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            {nextId ? (
              <Link href={`/characters/${nextId}`} className={styles.navButton}>
                Next →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
