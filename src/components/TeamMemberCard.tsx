"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "@/store/hooks";
import { removeMember } from "@/store/teamSlice";
import type { Character } from "@/types";
import CharacterImage from "./CharacterImage";
import { useDictionary } from "./DictionaryProvider";

interface Props {
  character: Character;
}

export default function TeamMemberCard({ character }: Props) {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useAppDispatch();
  const dict = useDictionary();
  const { lang } = useParams<{ lang: string }>();

  const stats: { label: string; value: string | number }[] = [
    ...(character.height ? [{ label: dict.character.stats.height, value: `${character.height} m` }] : []),
    ...(character.mass ? [{ label: dict.character.stats.mass, value: `${character.mass} kg` }] : []),
    ...(character.species ? [{ label: dict.character.stats.species, value: character.species }] : []),
    ...(character.gender ? [{ label: dict.character.stats.gender, value: character.gender }] : []),
    ...(character.homeworld && !Array.isArray(character.homeworld)
      ? [{ label: dict.character.stats.homeworld, value: character.homeworld }]
      : []),
    ...(character.born !== undefined ? [{ label: dict.character.stats.born, value: character.born }] : []),
  ];

  const affiliations = (Array.isArray(character.affiliations)
    ? character.affiliations
    : [character.affiliations]
  ).filter(Boolean).slice(0, 3);

  return (
    <Box
      sx={{ perspective: "1200px", height: 320, cursor: "pointer" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <Card
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ position: "relative", flex: 1 }}>
            <CharacterImage
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 640px) 50vw, 300px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Box>
          <Box sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
              {character.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dict.character.tapForStats}
            </Typography>
          </Box>
        </Card>

        {/* Back */}
        <Card
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
            {character.name}
          </Typography>
          <Divider />

          <Stack spacing={0.5} sx={{ flex: 1 }}>
            {stats.map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="caption" sx={{ textTransform: "capitalize" }}>{value}</Typography>
              </Box>
            ))}
          </Stack>

          {affiliations.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {affiliations.map((aff) => (
                <Chip key={aff} label={aff} size="small" variant="outlined" sx={{ fontSize: "0.65rem", height: 20, borderColor: "divider" }} />
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={Link}
              href={`/${lang}/characters/${character.id}`}
              size="small"
              variant="outlined"
              sx={{ flex: 1, borderColor: "divider", fontSize: "0.75rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              {dict.character.viewDetail}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              sx={{ flex: 1, fontSize: "0.75rem" }}
              onClick={(e) => { e.stopPropagation(); dispatch(removeMember(character.id)); }}
            >
              {dict.character.remove}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
