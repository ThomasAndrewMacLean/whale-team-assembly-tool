"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CharacterImage from "./CharacterImage";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { Character } from "@/types";
import { isEvilCharacter } from "@/logic";
import { useDictionary } from "./DictionaryProvider";

interface Props {
  character: Character;
}

export default function CharacterCard({ character }: Props) {
  const evil = isEvilCharacter(character);
  const dict = useDictionary();
  const { lang } = useParams<{ lang: string }>();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        outline: "2px solid transparent",
        outlineOffset: "0px",
        transition: "transform 0.2s, box-shadow 0.2s, outline-color 0.2s, outline-offset 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 32px rgba(255,232,31,0.12)",
        },
        "&:focus-within": {
          outlineColor: "#FFE81F",
          outlineOffset: "4px",
        },
      }}
    >
      {/* CardActionArea with component=Link renders as <a>, avoiding button-in-anchor */}
      <CardActionArea
        component={Link}
        href={`/${lang}/characters/${character.id}`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          // Suppress MUI's own focus-visible overlay — the Card border handles it
          "&.Mui-focusVisible": { bgcolor: "transparent" },
          "& .MuiTouchRipple-root": { display: "none" },
        }}
      >
        <ViewTransition name={`character-image-${character.id}`} share="morph">
          <Box sx={{ position: "relative", aspectRatio: "3/4", width: "100%", bgcolor: "background.paper" }}>
            <CharacterImage
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Box>
        </ViewTransition>
        <Box sx={{ p: 1.25 }}>
          <Typography
            variant="body2"
            noWrap
            sx={{ mb: evil ? 0.5 : 0, fontWeight: 600 }}
          >
            {character.name}
          </Typography>
          {evil && (
            <Chip
              label={dict.character.darkSide}
              size="small"
              sx={{
                bgcolor: "rgba(239,68,68,0.1)",
                color: "error.main",
                fontSize: "0.65rem",
                height: 20,
              }}
            />
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
