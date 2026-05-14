import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import MuiSkeleton from "@mui/material/Skeleton";
import CharacterGridSkeleton from "@/components/CharacterGridSkeleton";

export default function Loading() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <MuiSkeleton variant="text" width={320} height={56} />
        <MuiSkeleton variant="text" width={240} />
      </Box>
      <CharacterGridSkeleton count={24} />
    </Container>
  );
}
