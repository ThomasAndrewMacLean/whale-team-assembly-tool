"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme, type ColorMode, type FontSize } from "./theme";

export type { ColorMode, FontSize };

interface ThemeSettings {
  colorMode: ColorMode;
  fontSize: FontSize;
  setColorMode: (mode: ColorMode) => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeSettingsContext = createContext<ThemeSettings>({
  colorMode: "normal",
  fontSize: "normal",
  setColorMode: () => {},
  setFontSize: () => {},
});

export const useThemeSettings = () => useContext(ThemeSettingsContext);

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorMode, setColorModeState] = useState<ColorMode>("normal");
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const theme = useMemo(
    () => createAppTheme(colorMode, fontSize),
    [colorMode, fontSize],
  );

  return (
    <ThemeSettingsContext.Provider
      value={{ colorMode, fontSize, setColorMode, setFontSize }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}
