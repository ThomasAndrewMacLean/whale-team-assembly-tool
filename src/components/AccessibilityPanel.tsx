"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CloseIcon from "@mui/icons-material/Close";
import {
  useThemeSettings,
  type ColorMode,
  type FontSize,
} from "../theme/AppThemeProvider";
export { useThemeSettings };

const COLOR_OPTIONS: {
  value: ColorMode;
  label: string;
  description: string;
}[] = [
  { value: "normal", label: "Normal", description: "Default Star Wars theme" },
  {
    value: "protanopia",
    label: "Deuteranopia / Protanopia",
    description: "Safe for red-green colour blindness (Wong palette)",
  },
  {
    value: "tritanopia",
    label: "Tritanopia",
    description: "Safe for blue-yellow colour blindness",
  },
  {
    value: "high-contrast",
    label: "High Contrast",
    description: "Maximum contrast, minimal colour",
  },
];

const FONT_MARKS = [
  { value: 0, label: "Normal" },
  { value: 1, label: "Medium" },
  { value: 2, label: "Large" },
];

const FONT_SIZE_MAP: FontSize[] = ["normal", "medium", "large"];

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const { colorMode, fontSize, setColorMode, setFontSize } = useThemeSettings();

  const fontSizeIndex = FONT_SIZE_MAP.indexOf(fontSize);

  return (
    <>
      <Tooltip title="Accessibility settings" placement="bottom">
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Open accessibility settings"
          size="small"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          <AccessibilityNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="a11y-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          id="a11y-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" component="span">
            Accessibility Settings
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close accessibility settings"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom id="color-mode-label">
              Colour Mode
            </Typography>
            <RadioGroup
              aria-labelledby="color-mode-label"
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as ColorMode)}
            >
              {COLOR_OPTIONS.map(({ value, label, description }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: value === colorMode ? 600 : 400 }}
                      >
                        {label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {description}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 0.5, alignItems: "flex-start" }}
                />
              ))}
            </RadioGroup>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom id="font-size-label">
              Text Size
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                aria-labelledby="font-size-label"
                value={fontSizeIndex}
                onChange={(_, v) => setFontSize(FONT_SIZE_MAP[v as number])}
                step={1}
                min={0}
                max={2}
                marks={FONT_MARKS}
                valueLabelDisplay="off"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Current: {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
            </Typography>
          </Box>
        </DialogContent>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.5 }}>
          <Button
            size="small"
            onClick={() => {
              setColorMode("normal");
              setFontSize("normal");
            }}
            sx={{ color: "text.secondary", mr: 1 }}
          >
            Reset defaults
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
