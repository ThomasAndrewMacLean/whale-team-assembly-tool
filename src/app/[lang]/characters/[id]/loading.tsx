import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiSkeleton from "@mui/material/Skeleton";

export default function Loading() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MuiSkeleton variant="text" width={120} sx={{ mb: 3 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "2fr 3fr" },
          gap: 4,
        }}
      >
        <MuiSkeleton
          variant="rectangular"
          sx={{ aspectRatio: "3/4", borderRadius: 3 }}
        />
        <Stack spacing={2}>
          <MuiSkeleton variant="text" width="80%" height={48} />
          {[1, 2, 3, 4, 5].map((i) => (
            <MuiSkeleton key={i} variant="text" width={`${60 + i * 5}%`} />
          ))}
          <MuiSkeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </Box>
    </Container>
  );
}
