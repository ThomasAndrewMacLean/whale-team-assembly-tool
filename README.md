# Squad Assembler — Whale Front-end Test

A Star Wars character browser and team assembly tool, built as a front-end coding test for [Whale](https://whale.be).

**Live demo:** [whale.thomasmaclean.be](https://whale.thomasmaclean.be)

---

## Running locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server hot-reloads on save.

### Other commands

```bash
npm run build      # production build
npm start          # serve the production build
npm test           # run unit tests
npm run test:coverage  # run tests with coverage report
npm run lint       # ESLint
```

---

## Features

### Character browser

- Fetches all characters from the [Star Wars API](https://akabab.github.io/starwars-api/api/all.json) server-side (no API keys exposed to the client)
- Paginated grid with 12 / 24 / 48 items per page (dropdown selector)
- **Fuzzy search** — finds characters even with typos using subsequence matching (`"lke"` → `"Luke"`)
- Search query and current page are synced to URL query params (`?q=luke&page=2`) so the browser back button restores exactly where you were, including scroll position
- Skeleton placeholder cards shown during the initial data fetch (no layout shift)

### Character detail

- Full character profile: stats, affiliations, homeworld, species, equipment
- Shared-element view transition animation on the character image when navigating between the list and detail page
- Prev / next navigation between characters
- Keyboard shortcuts: `A` to add to team, `R` to remove, `←` / `→` to navigate

### Team panel

- Floating panel (persists across all pages) showing your current squad
- Add / remove characters from any page
- Team members are saved to `localStorage` and survive page refreshes; corrupt data falls back to an empty team gracefully
- Dedicated `/team` page with CSS 3D flip cards — front shows the photo, back shows character stats

### Evil character detection

- Characters are flagged as **Dark Side** if they match configurable keyword rules (Darth/Sith in name, affiliation, or master list)

### Internationalisation

- Three locales: **English**, **Huttese**, and **Mando'a**
- Language preference is persisted via a cookie so the middleware redirects bare URLs to the user's last-used locale
- `LanguageSwitcher` in the sticky header

### Accessibility

- **Colorblind modes**: normal, protanopia/deuteranopia (Wong palette), tritanopia, high-contrast
- **Font size control**: small / medium / large
- Keyboard shortcut `/` focuses the search bar, `T` toggles the team panel, `?` opens the shortcuts reference dialog
- Skip-to-content link and proper `<main>` landmark
- WCAG AA contrast on all chips and badges
- Focus-visible ring with transitions on all interactive elements

### Performance

- First 6 character images (a full row at `lg`) get `fetchpriority="high"` to improve LCP
- Remaining images are lazy-loaded
- Seeded SVG placeholders generated client-side for characters without a photo — same name always produces the same unique nebula/star-field illustration

### Theme

- Dark Star Wars theme (near-black background, Aurebesh yellow `#FFE81F` primary)
- Built with MUI v6, Emotion SSR via `AppRouterCacheProvider`

---

## Test coverage

146 tests across 11 suites (run `npm run test:coverage` to regenerate).

| Area                  | Suites                         | Highlights                                                                     |
| --------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| Logic                 | `logic.test.ts`                | 100% coverage — 17 tests for evil-character detection rules                    |
| Fuzzy search          | `fuzzy.test.ts`                | 100% coverage — 22 tests for exact match, subsequence, typo tolerance, ranking |
| Character placeholder | `characterPlaceholder.test.ts` | 100% coverage — 11 tests for seeded SVG consistency and structure              |
| Redux — team          | `teamSlice.test.ts`            | 100% coverage — 16 action/reducer tests                                        |
| Redux — characters    | `characterSlice.test.ts`       | 100% coverage — 4 tests                                                        |
| Team persistence      | `teamPersistence.test.ts`      | 88% coverage — 24 tests including corrupt-data and quota-exceeded scenarios    |
| i18n                  | `i18n.test.ts`                 | 100% coverage — 8 tests for locale config and helpers                          |
| SearchBar             | `SearchBar.test.tsx`           | 100% coverage — 10 component tests                                             |
| CharacterCard         | `CharacterCard.test.tsx`       | 100% coverage — 6 component tests                                              |
| TeamPanel             | `TeamPanel.test.tsx`           | 97% coverage — 12 component tests                                              |
| Global shortcuts      | `useGlobalShortcuts.test.ts`   | 100% coverage — 13 hook tests                                                  |

---

## AI usage

All prompts submitted to AI during development, along with reasoning for each, are documented in [AI_USAGE.md](./AI_USAGE.md).
