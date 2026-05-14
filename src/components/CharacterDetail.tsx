"use client";

import { useEffect } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMember, removeMember } from "@/store/teamSlice";
import { isEvilCharacter } from "@/logic";
import type { Character } from "@/types";
import CharacterImage from "./CharacterImage";
import { useDictionary } from "./DictionaryProvider";

interface Props {
  character: Character;
  prevId: number | null;
  nextId: number | null;
}

export default function CharacterDetail({ character, prevId, nextId }: Props) {
  const dispatch = useAppDispatch();
  const team = useAppSelector((state) => state.team.members);
  const router = useRouter();
  const dict = useDictionary();
  const { lang } = useParams<{ lang: string }>();

  const isInTeam = team.some((m) => m.id === character.id);
  const isEvil = isEvilCharacter(character);
  const teamFull = team.length >= 5;

  // Keyboard shortcuts for detail page: A=add, R=remove, ←=prev, →=next
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if (e.key === "a" || e.key === "A") {
        if (!isEvil && !isInTeam && !teamFull) dispatch(addMember(character));
      } else if (e.key === "r" || e.key === "R") {
        if (isInTeam) dispatch(removeMember(character.id));
      } else if (e.key === "ArrowLeft" && prevId) {
        router.push(`/${lang}/characters/${prevId}`);
      } else if (e.key === "ArrowRight" && nextId) {
        router.push(`/${lang}/characters/${nextId}`);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [character, isEvil, isInTeam, teamFull, dispatch, prevId, nextId, router, lang]);

  const stats: { label: string; value: string | number }[] = [
    ...(character.height ? [{ label: dict.character.stats.height, value: `${character.height} m` }] : []),
    ...(character.mass ? [{ label: dict.character.stats.mass, value: `${character.mass} kg` }] : []),
    ...(character.species ? [{ label: dict.character.stats.species, value: character.species }] : []),
    ...(character.gender ? [{ label: dict.character.stats.gender, value: character.gender }] : []),
    ...(character.homeworld && !Array.isArray(character.homeworld)
      ? [{ label: dict.character.stats.homeworld, value: character.homeworld }]
      : []),
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Button
        component={Link}
        href={`/${lang}`}
        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "0.75rem !important" }} />}
        sx={{ mb: 3, color: "text.secondary", "&:hover": { color: "primary.main" } }}
      >
        {dict.nav.allCharacters}
      </Button>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "2fr 3fr" },
          gap: 4,
          alignItems: "start",
        }}
      >
        <ViewTransition name={`character-image-${character.id}`} share="morph">
          <Box
            sx={{
              position: "relative",
              aspectRatio: "3/4",
              width: "100%",
              minHeight: 300,
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <CharacterImage
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
          </Box>
        </ViewTransition>

        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {character.name}
            </Typography>
            {isEvil && (
              <Chip
                label={dict.character.darkSide}
                sx={{ bgcolor: "rgba(239,68,68,0.1)", color: "error.main", fontWeight: 600 }}
              />
            )}
          </Box>

          <Box>
            {stats.map(({ label, value }, i) => (
              <Box key={label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                    {value}
                  </Typography>
                </Box>
                {i < stats.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>

          {character.affiliations.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.08em", display: "block", mb: 1 }}
              >
                {dict.character.stats.affiliations}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {character.affiliations.map((aff) => (
                  <Chip
                    key={aff}
                    label={aff}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.75rem", borderColor: "divider" }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box>
            {isEvil ? (
              <Button variant="outlined" disabled sx={{ borderColor: "divider", color: "text.disabled" }}>
                {dict.character.tooEvil}
              </Button>
            ) : isInTeam ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => dispatch(removeMember(character.id))}
              >
                {dict.character.removeFromTeam}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => dispatch(addMember(character))}
                disabled={teamFull}
              >
                {teamFull ? dict.character.teamFull : dict.character.addToTeam}
              </Button>
            )}
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {prevId ? (
              <Button
                component={Link}
                href={`/${lang}/characters/${prevId}`}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{ borderColor: "divider" }}
              >
                {dict.nav.previous}
              </Button>
            ) : (
              <span />
            )}
            {nextId ? (
              <Button
                component={Link}
                href={`/${lang}/characters/${nextId}`}
                endIcon={<ArrowForwardIcon />}
                variant="outlined"
                sx={{ borderColor: "divider" }}
              >
                {dict.nav.next}
              </Button>
            ) : (
              <span />
            )}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
