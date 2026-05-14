import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { fetchAllCharacters } from "@/api";
import CharacterGrid from "@/components/CharacterGrid";

export default async function HomePage() {
  const characters = await fetchAllCharacters();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Assemble Your Team
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose up to 5 heroes. Evil characters are not eligible.
        </Typography>
      </Box>
      <CharacterGrid characters={characters} />
    </Container>
  );
}
