"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCharacters } from "@/store/characterSlice";
import CharacterCard from "./CharacterCard";
import type { Character } from "@/types";
import styles from "./CharacterGrid.module.css";

interface Props {
  characters: Character[];
}

export default function CharacterGrid({ characters }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCharacters(characters));
  }, [dispatch, characters]);

  return (
    <div className={styles.grid}>
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
