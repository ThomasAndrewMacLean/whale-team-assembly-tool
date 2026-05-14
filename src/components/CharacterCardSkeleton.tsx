import Card from "@mui/material/Card";
import MuiSkeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function CharacterCardSkeleton() {
  return (
    <Card>
      <Box sx={{ position: "relative", aspectRatio: "3/4", width: "100%" }}>
        <MuiSkeleton
          variant="rectangular"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </Box>
      <Box sx={{ p: 1.25 }}>
        <MuiSkeleton variant="text" width="70%" />
        <MuiSkeleton variant="text" width="40%" />
      </Box>
    </Card>
  );
}
