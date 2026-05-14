"use client";

import { useEffect, useCallback } from "react";

interface Options {
  onToggleTeam?: () => void;
  onShowShortcuts?: () => void;
}

/**
 * Registers global keyboard shortcuts.
 * Individual pages/components can also register their own via standard keydown listeners.
 */
export default function useGlobalShortcuts({
  onToggleTeam,
  onShowShortcuts,
}: Options = {}) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea/select
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // "?" — show shortcuts (always active)
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onShowShortcuts?.();
        return;
      }

      if (inInput) return;

      // "/" — focus search bar
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("app:focus-search"));
        return;
      }

      // "T" — toggle team panel
      if ((e.key === "t" || e.key === "T") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleTeam?.();
        return;
      }
    },
    [onToggleTeam, onShowShortcuts],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
