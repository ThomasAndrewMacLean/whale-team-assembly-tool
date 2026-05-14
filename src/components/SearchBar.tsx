"use client";

import { useEffect, useRef } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search characters…" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for global focus-search event (triggered by "/" shortcut)
  useEffect(() => {
    const handler = () => inputRef.current?.focus();
    window.addEventListener("app:focus-search", handler);
    return () => window.removeEventListener("app:focus-search", handler);
  }, []);

  return (
    <TextField
      inputRef={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      aria-label="Search characters"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onChange("")}
                aria-label="Clear search"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{ mb: 3 }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onChange("");
          inputRef.current?.blur();
        }
      }}
    />
  );
}
