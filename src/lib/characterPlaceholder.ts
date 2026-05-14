/**
 * Generates a seeded, Star-Wars-themed SVG avatar data URI from a character name.
 * Same name → same image on every render; different names → different images.
 */

const NEBULA_COLORS = [
  "#FFE81F", // Star Wars yellow
  "#4FC3F7", // ice blue
  "#7C4DFF", // violet
  "#FF5252", // sith red
  "#69F0AE", // jedi green
  "#FF6D00", // Mandalorian orange
  "#40C4FF", // electric cyan
  "#E040FB", // Force magenta
  "#B0BEC5", // droid silver
];

function nameToSeed(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Mulberry32 PRNG — fast, good distribution */
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function generateCharacterPlaceholder(name: string): string {
  const rand = seededRand(nameToSeed(name));
  const W = 200;
  const H = 266;

  // ── Nebula blobs (3 large semi-transparent circles)
  const blobColors = [
    pick(NEBULA_COLORS, rand),
    pick(NEBULA_COLORS, rand),
    pick(NEBULA_COLORS, rand),
  ];
  const blobs = blobColors.map((color) => {
    const cx = (rand() * W * 1.2 - W * 0.1).toFixed(1);
    const cy = (rand() * H * 1.2 - H * 0.1).toFixed(1);
    const r = (55 + rand() * 90).toFixed(1);
    const opacity = (0.1 + rand() * 0.16).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
  });

  // ── Tiny star field (28 dots)
  const stars = Array.from({ length: 28 }, () => {
    const x = (rand() * W).toFixed(1);
    const y = (rand() * H).toFixed(1);
    const r = (0.4 + rand() * 1.4).toFixed(2);
    const op = (0.35 + rand() * 0.65).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${op}"/>`;
  });

  // ── Horizon glow line (subtle)
  const glowY = (H * (0.55 + rand() * 0.2)).toFixed(1);
  const glowColor = blobColors[0];

  // ── Initials (first letter of each word, max 2)
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  const textColor = blobColors[0];
  const cx = W / 2;
  const cy = H / 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#04040e"/>
  ${blobs.join("\n  ")}
  <ellipse cx="${cx}" cy="${glowY}" rx="${(60 + rand() * 60).toFixed(1)}" ry="18" fill="${glowColor}" opacity="0.07"/>
  ${stars.join("\n  ")}
  <text
    x="${cx}" y="${cy + 6}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="system-ui, sans-serif"
    font-size="56" font-weight="800"
    fill="${textColor}" opacity="0.88"
    letter-spacing="6"
  >${initials}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
