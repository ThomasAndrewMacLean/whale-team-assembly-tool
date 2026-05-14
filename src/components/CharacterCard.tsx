import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types";
import { isEvilCharacter } from "@/logic";
import styles from "./CharacterCard.module.css";

interface Props {
  character: Character;
}

export default function CharacterCard({ character }: Props) {
  const evil = isEvilCharacter(character);

  return (
    <Link href={`/characters/${character.id}`} className={styles.card}>
      <ViewTransition name={`character-image-${character.id}`} share="morph">
        <div className={styles.imageWrapper}>
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={styles.image}
          />
        </div>
      </ViewTransition>
      <div className={styles.info}>
        <h3 className={styles.name}>{character.name}</h3>
        {evil && <span className={styles.evilBadge}>⚡ Dark Side</span>}
      </div>
    </Link>
  );
}
