"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import AccessibilityPanel from "./AccessibilityPanel";
import KeyboardShortcuts from "./KeyboardShortcuts";
import LanguageSwitcher from "./LanguageSwitcher";
import useGlobalShortcuts from "@/hooks/useGlobalShortcuts";

/**
 * Client component grouping all interactive header controls.
 * Mounts global keyboard shortcuts so they work across all pages.
 */
export default function HeaderControls() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useGlobalShortcuts({
    onToggleTeam: () => window.dispatchEvent(new CustomEvent("app:toggle-team")),
    onShowShortcuts: () => setShortcutsOpen(true),
  });

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <AccessibilityPanel />
        <Tooltip title="Keyboard shortcuts (?)" placement="bottom">
          <IconButton
            onClick={() => setShortcutsOpen(true)}
            aria-label="Show keyboard shortcuts"
            size="small"
            sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <KeyboardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <LanguageSwitcher />
      </Box>
      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
