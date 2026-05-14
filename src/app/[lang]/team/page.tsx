"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAppSelector } from "@/store/hooks";
import TeamMemberCard from "@/components/TeamMemberCard";
import { useDictionary } from "@/components/DictionaryProvider";

export default function TeamPage() {
  const team = useAppSelector((state) => state.team.members);
  const dict = useDictionary();
  const { lang } = useParams<{ lang: string }>();

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button
          component={Link}
          href={`/${lang}`}
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "0.75rem !important" }} />}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          {dict.nav.allCharacters}
        </Button>
        <Typography variant="h4" component="h1">
          {dict.team.heading} ({team.length}/5)
        </Typography>
      </Box>

      {team.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" gutterBottom>
            {dict.team.empty}
          </Typography>
          <Button component={Link} href={`/${lang}`} variant="outlined" color="primary">
            {dict.team.browse}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {team.map((member) => (
            <Grid key={member.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <TeamMemberCard character={member} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
