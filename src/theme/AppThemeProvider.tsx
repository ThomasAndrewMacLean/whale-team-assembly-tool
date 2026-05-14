"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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

const STORAGE_KEY = "sw-theme-settings";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorMode, setColorModeState] = useState<ColorMode>("normal");
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ThemeSettings>;
        if (parsed.colorMode) setColorModeState(parsed.colorMode);
        if (parsed.fontSize) setFontSizeState(parsed.fontSize);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    persist(mode, fontSize);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    persist(colorMode, size);
  };

  const persist = (mode: ColorMode, size: FontSize) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ colorMode: mode, fontSize: size }));
    } catch {
      // ignore
    }
  };

  const theme = useMemo(
    () => createAppTheme(mounted ? colorMode : "normal", mounted ? fontSize : "normal"),
    [colorMode, fontSize, mounted]
  );

  return (
    <ThemeSettingsContext.Provider value={{ colorMode, fontSize, setColorMode, setFontSize }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}
