"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeMember } from "@/store/teamSlice";
import CharacterImage from "./CharacterImage";
import { useDictionary } from "./DictionaryProvider";

export default function TeamPanel() {
  const [open, setOpen] = useState(false);
  const team = useAppSelector((state) => state.team.members);
  const dispatch = useAppDispatch();
  const dict = useDictionary();
  const { lang } = useParams<{ lang: string }>();

  // "T" keyboard shortcut toggles the panel via CustomEvent
  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener("app:toggle-team", handler);
    return () => window.removeEventListener("app:toggle-team", handler);
  }, []);

  return (
    <>
      <Badge
        badgeContent={team.length}
        color="error"
        overlap="circular"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
          "& .MuiBadge-badge": { zIndex: 101 },
        }}
      >
        <Fab
          color="primary"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle team panel"
          sx={{ color: "primary.contrastText", zIndex: 0 }}
        >
          <GroupsIcon />
        </Fab>
      </Badge>

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: 300,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            zIndex: 99,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              {dict.team.heading} ({team.length}/5)
            </Typography>
            <Button
              component={Link}
              href={`/${lang}/team`}
              size="small"
              endIcon={<OpenInNewIcon sx={{ fontSize: "0.8rem !important" }} />}
              onClick={() => setOpen(false)}
              sx={{ color: "text.secondary", fontSize: "0.75rem" }}
            >
              {dict.nav.fullPage}
            </Button>
          </Box>

          <Box sx={{ p: 1.5 }}>
            {team.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 1, textAlign: "center" }}
              >
                {dict.team.noMembers}
              </Typography>
            ) : (
              <Stack spacing={1}>
                {team.map((member) => (
                  <Box
                    key={member.id}
                    sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "background.default",
                        flexShrink: 0,
                      }}
                    >
                      <CharacterImage
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="36px"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </Avatar>
                    <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                      {member.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(removeMember(member.id))}
                      aria-label={`Remove ${member.name}`}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: "0.9rem" }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
}
