import Grid from "@mui/material/Grid";
import CharacterCardSkeleton from "./CharacterCardSkeleton";

interface Props {
  count?: number;
}

export default function CharacterGridSkeleton({ count = 20 }: Props) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          <CharacterCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
