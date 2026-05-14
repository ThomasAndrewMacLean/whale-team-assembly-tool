import type { Character } from "@/types";

const STORAGE_KEY = "sw-team";

export interface PersistedTeamState {
  members: Character[];
}

function isValidCharacter(value: unknown): value is Character {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "number" && typeof v.name === "string";
}

export function isValidTeamState(value: unknown): value is PersistedTeamState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.members) && v.members.every(isValidCharacter);
}

export function loadTeamState(): PersistedTeamState | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidTeamState(parsed)) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function saveTeamState(state: PersistedTeamState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage quota exceeded or private browsing — silently ignore
  }
}
