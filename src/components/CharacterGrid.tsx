"use client";

import { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "@/store/hooks";
import { setCharacters } from "@/store/characterSlice";
import CharacterCard from "./CharacterCard";
import SearchBar from "./SearchBar";
import { fuzzyFilter } from "@/lib/fuzzy";
import type { Character } from "@/types";

interface Props {
  characters: Character[];
}

export default function CharacterGrid({ characters }: Props) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(setCharacters(characters));
  }, [dispatch, characters]);

  const filtered = useMemo(
    () => fuzzyFilter(characters, query, (c) => c.name),
    [characters, query],
  );

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      {filtered.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No characters found for &ldquo;{query}&rdquo;
        </Typography>
      ) : (
        <Grid
          container
          spacing={2}
          component="ul"
          aria-label="Character list"
          sx={{ listStyle: "none", p: 0, m: 0 }}
        >
          {filtered.map((character) => (
            <Grid
              key={character.id}
              size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
              component="li"
            >
              <CharacterCard character={character} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
