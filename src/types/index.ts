export interface Character {
  id: number;
  name: string;
  height?: number;
  mass?: number;
  gender: string;
  homeworld?: string | string[];
  wiki: string;
  image: string;
  species: string;
  hairColor?: string;
  eyeColor: string;
  skinColor: string;
  born?: number | string;
  bornLocation?: string;
  died?: number;
  diedLocation?: string;
  cybernetics?: string | string[];
  affiliations: string[];
  formerAffiliations: string[];
  masters?: string | string[];
  apprentices?: string | string[];
  era?: string[];
  // Droid-specific fields
  dateCreated?: number;
  dateDestroyed?: number;
  destroyedLocation?: string;
  creator?: string;
  manufacturer?: string;
  productLine?: string;
  model?: string;
  class?: string;
  degree?: string;
  sensorColor?: string;
  platingColor?: string;
  equipment?: string | string[];
  armament?: string | string[];
  // Character-specific fields
  kajidic?: string;
}
