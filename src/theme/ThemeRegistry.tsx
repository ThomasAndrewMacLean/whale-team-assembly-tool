import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AppThemeProvider from "./AppThemeProvider";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </AppRouterCacheProvider>
  );
}
