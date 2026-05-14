"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardIcon from "@mui/icons-material/Keyboard";

export const SHORTCUTS = [
  {
    group: "Navigation",
    items: [
      { keys: ["/"], description: "Focus search bar" },
      { keys: ["Esc"], description: "Close search / dismiss panel" },
      {
        keys: ["←", "→"],
        description: "Previous / next character (detail page)",
      },
    ],
  },
  {
    group: "Team",
    items: [
      { keys: ["T"], description: "Open / close your team panel" },
      {
        keys: ["A"],
        description: "Add current character to team (detail page)",
      },
      {
        keys: ["R"],
        description: "Remove current character from team (detail page)",
      },
    ],
  },
  {
    group: "Help",
    items: [{ keys: ["?"], description: "Show this keyboard shortcuts list" }],
  },
];

interface Props {
  /** Controlled — allow parent to open via shortcut */
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ open, onClose }: Props) {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="shortcuts-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="shortcuts-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <KeyboardIcon fontSize="small" />
            <Typography variant="h6" component="span">
              Keyboard Shortcuts
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {SHORTCUTS.map((group, gi) => (
            <Box
              key={group.group}
              sx={{ mb: gi < SHORTCUTS.length - 1 ? 2.5 : 0 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  mb: 1,
                }}
              >
                {group.group}
              </Typography>
              {group.items.map(({ keys, description }) => (
                <Box
                  key={description}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {keys.map((k) => (
                      <Box
                        key={k}
                        component="kbd"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 28,
                          px: 0.75,
                          py: 0.25,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: "4px",
                          bgcolor: "background.paper",
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "text.primary",
                          boxShadow: "0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        {k}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
              {gi < SHORTCUTS.length - 1 && <Divider sx={{ mt: 1.5 }} />}
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Standalone trigger button for the header */
export function KeyboardShortcutsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Keyboard shortcuts (?)" placement="bottom">
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Show keyboard shortcuts"
          size="small"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          <KeyboardIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <KeyboardShortcuts open={open} onClose={() => setOpen(false)} />
    </>
  );
}
