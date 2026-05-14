"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { removeMember } from "@/store/teamSlice";
import type { Character } from "@/types";
import styles from "./TeamMemberCard.module.css";

interface Props {
  character: Character;
}

export default function TeamMemberCard({ character }: Props) {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useAppDispatch();

  const stats: { label: string; value: string | number }[] = [
    ...(character.height ? [{ label: "Height", value: `${character.height} m` }] : []),
    ...(character.mass ? [{ label: "Mass", value: `${character.mass} kg` }] : []),
    ...(character.species ? [{ label: "Species", value: character.species }] : []),
    ...(character.gender ? [{ label: "Gender", value: character.gender }] : []),
    ...(character.homeworld && !Array.isArray(character.homeworld)
      ? [{ label: "Homeworld", value: character.homeworld }]
      : []),
    ...(character.born !== undefined ? [{ label: "Born", value: character.born }] : []),
  ];

  return (
    <div
      className={`${styles.scene} ${flipped ? styles.flipped : ""}`}
      onClick={() => setFlipped((f) => !f)}
      aria-label={`${character.name} card, click to ${flipped ? "show image" : "show details"}`}
    >
      <div className={styles.card}>
        {/* FRONT */}
        <div className={styles.face}>
          <div className={styles.imageWrapper}>
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className={styles.image}
            />
          </div>
          <div className={styles.frontInfo}>
            <h3 className={styles.name}>{character.name}</h3>
            <span className={styles.hint}>Tap to flip ↩</span>
          </div>
        </div>

        {/* BACK */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.backContent}>
            <h3 className={styles.backName}>{character.name}</h3>

            <ul className={styles.statList}>
              {stats.map(({ label, value }) => (
                <li key={label} className={styles.statRow}>
                  <span className={styles.statLabel}>{label}</span>
                  <span className={styles.statValue}>{value}</span>
                </li>
              ))}
            </ul>

            {character.affiliations.length > 0 && (
              <div className={styles.affiliationsBlock}>
                <span className={styles.sectionLabel}>Affiliations</span>
                <p className={styles.affiliationText}>
                  {character.affiliations.slice(0, 3).join(" · ")}
                  {character.affiliations.length > 3 ? " …" : ""}
                </p>
              </div>
            )}

            <div className={styles.backActions}>
              <Link
                href={`/characters/${character.id}`}
                className={styles.detailLink}
                onClick={(e) => e.stopPropagation()}
              >
                View detail →
              </Link>
              <button
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeMember(character.id));
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
