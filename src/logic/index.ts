import type { Character } from "@/types";

/**
 * Keywords that mark a character as evil when found in their name or affiliations.
 * Extend this array to add new evil indicators.
 */
const EVIL_NAME_KEYWORDS = ["Darth", "Sith"];

/**
 * Keywords that mark a character as evil when found in one of their masters' names.
 */
const EVIL_MASTER_KEYWORDS = ["Darth"];

const toPattern = (keywords: string[]) =>
  new RegExp(keywords.join("|"), "i");

export function isEvilCharacter(character: Character): boolean {
  const evilNamePattern = toPattern(EVIL_NAME_KEYWORDS);
  const evilMasterPattern = toPattern(EVIL_MASTER_KEYWORDS);

  if (evilNamePattern.test(character.name)) return true;

  const hasEvilAffiliation = character.affiliations.some((aff) =>
    evilNamePattern.test(aff)
  );
  if (hasEvilAffiliation) return true;

  const masters = Array.isArray(character.masters)
    ? character.masters
    : character.masters
    ? [character.masters]
    : [];

  return masters.some((m) => evilMasterPattern.test(m));
}
