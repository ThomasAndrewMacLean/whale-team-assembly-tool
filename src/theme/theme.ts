import { createTheme } from "@mui/material/styles";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export type ColorMode = "normal" | "protanopia" | "tritanopia" | "high-contrast";
export type FontSize = "normal" | "medium" | "large";

const PALETTES: Record<ColorMode, { primary: string; secondary: string; error: string; bgDefault: string; bgPaper: string }> = {
  normal: {
    primary: "#FFE81F",
    secondary: "#4FC3F7",
    error: "#EF4444",
    bgDefault: "#0a0a14",
    bgPaper: "#111827",
  },
  // Wong palette adjustments — safe for deuteranopia & protanopia (red-green blind)
  protanopia: {
    primary: "#F0E442", // yellow — still fine
    secondary: "#56B4E9", // sky blue — fine
    error: "#E69F00",   // orange — replaces red, clearly distinguishable
    bgDefault: "#0a0a14",
    bgPaper: "#111827",
  },
  // Tritanopia — can't distinguish blue/yellow; use orange + pink
  tritanopia: {
    primary: "#E66100",  // vivid orange
    secondary: "#CC79A7", // pink/mauve
    error: "#882255",    // deep wine
    bgDefault: "#0a0a14",
    bgPaper: "#111827",
  },
  "high-contrast": {
    primary: "#FFFFFF",
    secondary: "#FFFF00",
    error: "#FF6666",
    bgDefault: "#000000",
    bgPaper: "#111111",
  },
};

const FONT_SIZES: Record<FontSize, number> = { normal: 14, medium: 16, large: 18 };

export function createAppTheme(
  colorMode: ColorMode = "normal",
  fontSize: FontSize = "normal"
) {
  const p = PALETTES[colorMode];
  const fontSizeBase = FONT_SIZES[fontSize];
  const isHighContrast = colorMode === "high-contrast";

  return createTheme({
    palette: {
      mode: "dark",
      primary: { main: p.primary, contrastText: isHighContrast ? "#000000" : "#0a0a14" },
      secondary: { main: p.secondary, contrastText: "#0a0a14" },
      error: { main: p.error },
      warning: { main: "#F97316" },
      background: { default: p.bgDefault, paper: p.bgPaper },
      text: {
        primary: isHighContrast ? "#FFFFFF" : "#F9FAFB",
        secondary: isHighContrast ? "#DDDDDD" : "#9CA3AF",
      },
      divider: isHighContrast ? "#555555" : "#1F2937",
    },
    typography: {
      fontSize: fontSizeBase,
      fontFamily: geist.style.fontFamily,
      h1: { fontWeight: 700, letterSpacing: "0.04em" },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { height: "100%" },
          body: {
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          a: { color: "inherit", textDecoration: "none" },
          // Visible focus ring for all focusable elements
          "*:focus-visible": {
            outline: `3px solid ${p.primary} !important`,
            outlineOffset: "3px !important",
            borderRadius: "4px",
          },
          // Skip to main content
          ".skip-link": {
            position: "absolute",
            left: "-9999px",
            top: "8px",
            zIndex: 9999,
            padding: "8px 20px",
            background: p.primary,
            color: isHighContrast ? "#000000" : "#0a0a14",
            fontWeight: 700,
            fontSize: "0.9rem",
            borderRadius: "0 0 8px 0",
            "&:focus": { left: "8px" },
          },
          // View transitions
          "::view-transition-group(.morph)": {
            animationDuration: "450ms",
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "::view-transition-old(root)": { animation: "vt-fade-out 120ms ease-out" },
          "::view-transition-new(root)": { animation: "vt-fade-in 120ms ease-in" },
          "@keyframes vt-fade-out": { from: { opacity: 1 }, to: { opacity: 0 } },
          "@keyframes vt-fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
          "@keyframes pulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&:focus-visible": {
              outline: `3px solid ${p.primary}`,
              outlineOffset: "3px",
              borderRadius: "4px",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { backgroundImage: "none", border: `1px solid ${isHighContrast ? "#555555" : "#1F2937"}` },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 4 } },
      },
    },
  });
}

// Default export for non-dynamic usage (SSR initial render)
export default createAppTheme();
