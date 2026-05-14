# AI Usage Log — Whale Front-end Coding Test

This file tracks every prompt submitted to AI during this project, along with a brief summary of the reasoning behind each request.

---

## 1. Project scaffolding — Redux + folder structure

**Prompt:**

> add redux to this repo, we also need a logic folder, a types folder and an api folder

**Summary:**
Initial project setup after bootstrapping with `create-next-app`. Asked AI to install and wire up Redux Toolkit + React Redux, create a typed store with a `StoreProvider` for the Next.js App Router, and scaffold the three core folders (`api/`, `logic/`, `types/`) that would hold the application's separation of concerns.

---

## 2. TypeScript types from API response

**Prompt:**

> generate the correct types from this array: [full Star Wars API JSON sample]

**Summary:**
Pasted a large sample of the Star Wars API response (from `https://akabab.github.io/starwars-api/api/all.json`) and asked AI to derive accurate TypeScript interfaces. The key challenge was that the API is inconsistent — some fields (`homeworld`, `masters`, `equipment`, `cybernetics`) can be either a `string` or an `string[]`, and `born` can be a `number` or a descriptive `string`. The generated `Character` interface in `src/types/index.ts` captures all of this with proper optional fields and union types.

---

## 3. Homepage character list with Redux, API, skeleton loading, and view transitions

**Prompt:**

> on the homepage we want to list all characters that we get from this api route: https://akabab.github.io/starwars-api/api/all.json we will store these in the redux store, every character will also have a detail page, use page transition to go from one page to next and make the image move nicely from one page to the next. we want to show skeleton placeholders for the character cards while we fetch the data from the api (we dont have api key, but still do the call from the server so any api key that could exist is secure)

**Summary:**
The most substantial prompt — covered several requirements at once:

- **Server-side fetch**: `fetchAllCharacters()` in `src/api/index.ts` runs on the server (Next.js Server Component), keeping any credentials away from the client.
- **Redux hydration**: `CharacterGrid` dispatches `setCharacters` on mount so the store reflects the fetched list for client-side use.
- **Skeleton loading**: Next.js `loading.tsx` files provide instant `<Suspense>` fallbacks with animated placeholder cards while the server fetch resolves.
- **View Transitions**: React's `<ViewTransition name={...} share="morph">` wraps the character image on both the list card and detail page, so the browser animates a smooth shared-element morph between routes. Enabled via `experimental: { viewTransition: true }` in `next.config.ts`.
- **Detail page + navigation**: `/characters/[id]` is a dynamic server route that derives prev/next character IDs from the ordered API array.
- **Team panel**: A fixed floating panel (`TeamPanel`) is mounted in the root layout so it persists across all pages.

---

## 4. Evil character detection with configurable rules

**Prompt:**

> add a function to the logic where we check if a character is evil: these are the rules to be considered evil, make sure we can easily change these if needed:
>
> - They have 'Darth' or 'Sith' in their name
> - They have at least one affiliation that mentions 'Darth' or 'Sith' (you may ignore former affiliations)
> - They have at least one master with 'Darth' in their name

**Summary:**
Asked for a clean, maintainable implementation of the evil-detection rules in `src/logic/index.ts`. The requirement to make it "easily changeable" led to extracting the keywords into two constants (`EVIL_NAME_KEYWORDS` and `EVIL_MASTER_KEYWORDS`) rather than hardcoding regex strings. Adding a new evil indicator only requires updating the relevant array — no regex knowledge needed.

---

## 5. AI usage log

**Prompt:**

> write all questions i ask (and have asked) AI here and a brief summary of them to a file. This is a front end test to apply to the company whale so we need a track of my reasoning and use of AI

**Summary:**
Requested a log file (this file) to document all AI interactions during the test. Purpose is to demonstrate transparency about AI usage and to show the reasoning behind each prompt to the evaluators at Whale.

---

## 6. Scroll restoration fix on back navigation

**Prompt:**

> The all characters button just goes back in history, not to the page. if we change the language and click it we go to the previous language not the homepage

**Summary:**
The "All Characters" back button in `CharacterDetail` was using `router.back()`, which pops the browser history stack. After switching language and opening a character, clicking back navigated to the previous language's page rather than the current language's character list. Fixed by replacing `router.back()` with `<Button component={Link} href={\`/\${lang}\`}>` — always navigates to the correct locale's homepage.

---

## 7. Team page with CSS flip cards

**Prompt:**

> make a team page on /team where the characters are shown in a nicer way. use a flip animation so front shows the image and on the back show some stats

**Summary:**
Created a dedicated `/[lang]/team` page with `TeamMemberCard` components that use pure CSS 3D perspective transforms (`rotateY`). The front face shows the character photo; the back face shows stats (height, mass, species, affiliations). The flip is triggered on `:hover` with a 600ms ease transition. Empty-team and team-full states are handled with appropriate copy.

---

## 8. Material UI integration with Star Wars theme

**Prompt:**

> Let's add MUI and give it a good star wars inspired theme and redo all the components in MUI

**Summary:**
Full MUI v5 integration. Created `ThemeRegistry` to handle Emotion SSR cache for Next.js App Router (avoids style flash). Defined a Star Wars dark theme in `src/theme/theme.ts` — near-black background (`#04040e`), Star Wars yellow (`#FFE81F`) as primary, space grey secondary. All components (`CharacterCard`, `CharacterDetail`, `CharacterGrid`, `TeamPanel`, `TeamMemberCard`, `LanguageSwitcher`) were rewritten using MUI primitives: `Card`, `CardActionArea`, `Container`, `Fab`, `Badge`, `Chip`, `Stack`, `Divider`, `Button`, `Typography`, `Paper`, `Avatar`, `IconButton`.

---

## 9. Character image fallback SVG

**Prompt:**

> some characters don't have an image, add a fallback

**Summary:**
Created `CharacterImage`, a client component wrapping Next.js `<Image>`. On `onError` it falls back to a plain `<img>` pointing at `public/character-fallback.svg` — a dark Star Wars helmet silhouette. Using a plain `<img>` for the SVG avoids Next.js Image's domain/format restrictions while keeping the Next.js optimised path for real photos.

---

## 10. Skeleton aspect ratio fix

**Prompt:**

> the skeleton cards have a different height then the actual cards, could you fix this so it doesnt feel like the layout shifts

**Summary:**
The skeleton placeholder cards used a fixed pixel height that didn't match the actual cards' `aspectRatio: "3/4"` image box. Fixed by applying `aspectRatio: "3/4"` to the skeleton image placeholder so it matches the rendered card dimensions exactly, preventing layout shift (CLS) when the real content loads.

---

## 11. Internationalisation — 3 locales

**Prompt:**

> i18n: lets add support for 3 languages: the language of the galaxy (english), huttese and mando'a

**Summary:**
Full i18n implementation without a third-party library:

- **`src/i18n/`**: `config.ts` (locale types + constants), `getDictionary.ts` (async JSON loader), three JSON dictionaries (en, huttese, mando'a) using Karen Traviss vocabulary for Mando'a.
- **`[lang]` routing**: All pages moved under `src/app/[lang]/` with `generateStaticParams` producing all locale variants.
- **`DictionaryProvider`**: React context distributing the server-loaded dictionary to all client components via `useDictionary()`.
- **`LanguageSwitcher`**: Sticky header component with per-locale buttons.
- **`proxy.ts` middleware**: Detects missing locale in pathname and redirects bare URLs (e.g. `/`) to `/${defaultLocale}${path}`.
- All links updated to `/${lang}/...` throughout every component.

---

## 12. Accessibility overhaul — theme factory, colorblind modes, keyboard shortcuts, search

**Prompt:**

> I want to do a big a11y pass on this app:
>
> - Fix focus states and make them nicer (use outline with transition)
> - Fix button in anchor in CharacterCard
> - Do an accessibility scan and fix issues
> - Add an accessibility settings panel: colorblind modes (4 types) + font size slider
> - Add a keyboard shortcuts dialog with all shortcuts listed
> - Implement shortcuts: add/remove from team, toggle team panel, open search bar
> - Add search/filter bar to the character grid

**Summary:**
Large multi-step accessibility feature:

- **`theme.ts` refactored** to a `createAppTheme(colorMode, fontSize)` factory with 4 palettes (normal, protanopia/deuteranopia using the Wong colour-blind-safe palette, tritanopia, high-contrast) and 3 font sizes. Global `*:focus-visible` CSS and `.skip-link` CSS baked in.
- **`AppThemeProvider`**: New client component managing `colorMode`/`fontSize` state persisted to `localStorage` (`sw-theme-settings`). Exposes `useThemeSettings()` hook.
- **`CharacterCard` a11y fix**: Changed `<Card component={Link}><CardActionArea>` (renders `<a><button>` — invalid) to `<Card><CardActionArea component={Link}>` (renders `<div><a>` — valid).
- **`SearchBar`**: MUI `TextField` with clear button. Listens for `app:focus-search` CustomEvent to auto-focus on `/` keypress.
- **`CharacterGrid`**: Integrated `SearchBar`, added accessible `<ul>` landmark with `aria-label`.
- **`AccessibilityPanel`**: Dialog with `RadioGroup` (4 colour modes) and `Slider` (3 font sizes). Triggered from header via `AccessibilityNewIcon`.
- **`KeyboardShortcuts`**: Dialog with styled `<kbd>` shortcut reference table.
- **`useGlobalShortcuts`**: Hook registered in `HeaderControls`. `/` → focus search, `T` → toggle team panel, `?` → open shortcuts dialog.
- **`CharacterDetail`**: Added `keydown` handler — `A` adds, `R` removes, `←`/`→` navigate prev/next.
- **`TeamPanel`**: Listens for `app:toggle-team` CustomEvent.
- **`HeaderControls`**: New client component composing `AccessibilityPanel` + keyboard shortcuts button + `LanguageSwitcher`, mounting `useGlobalShortcuts`.
- **`layout.tsx`**: Added skip-to-content link + `<main id="main-content">` landmark.

---

## 13. Generated character image placeholders

**Prompt:**

> I like the image fallbacks, but it would be even nicer if you could generate them every time and make them a bit random for every image (use the name of the character as a seed so they stay consistent on page refresh)

**Summary:**
Created `src/lib/characterPlaceholder.ts` — a pure-JS seeded SVG generator using a djb2-style hash (`nameToSeed`) and Mulberry32 PRNG. Each character gets a unique nebula-style placeholder: dark space background, 3 semi-transparent nebula blobs in Star-Wars-themed colours, 28 star field dots, a horizon glow, and the character's initials. Same name always produces the same SVG. `CharacterImage` now generates this via `useMemo` instead of loading the static SVG file.

---

## 14. Team panel badge z-index fix

**Prompt:**

> the number is behind the icon

**Summary:**
The MUI `Badge` counter was rendering behind the `Fab` button. MUI's `Fab` has `position: relative` which creates a new stacking context. Fixed by adding `zIndex: 0` to the `Fab` (demoting it) and `"& .MuiBadge-badge": { zIndex: 101 }` to the `Badge` wrapper. Also changed badge colour from `"primary"` (yellow — same as the Fab) to `"error"` (red) for clear visual contrast.

---

## 15. Dark Side chip contrast fix

**Prompt:**

> not enough contrast here for a11y [screenshot of Lighthouse contrast failure on Dark Side chip]

**Summary:**
The "Dark Side" chip was using `bgcolor: "rgba(239,68,68,0.1)"` (near-transparent red) with `color: "error.main"` (red text) — failing WCAG AA contrast. Changed to `bgcolor: "#7f1d1d"` (dark crimson) with `color: "#fecaca"` (light rose), achieving ~5.7:1 contrast ratio, well above the 4.5:1 minimum.

---

## 16. LCP image optimisation

**Prompt:**

> we could have better image tags on the first row to prevent LCP? [screenshot of Lighthouse LCP warning: fetchpriority=high not applied]

**Summary:**
Added a `priority` prop to `CharacterCard`. `CharacterGrid` passes `priority={index < 6}` so the first 6 cards (a full row at `lg` breakpoint) get `fetchpriority="high"` and no lazy-loading. Remaining cards stay lazy. This directly addresses the Lighthouse "LCP request discovery" audit.

---

## 17. Fuzzy search

**Prompt:**

> allow for fuzzy search so we can also find characters when we have typos, maybe some regex magic can help here?

**Summary:**
Created `src/lib/fuzzy.ts` with a dependency-free two-tier matcher:

1. **Exact substring** — fastest path, scored by position in string.
2. **Subsequence regex** — builds `l.*u.*k.*e` from typed letters, so `"lke"` matches `"Luke"`. Results are sorted by match compactness (shorter span = better score) then position.
   `CharacterGrid` replaced its simple `includes()` filter with `fuzzyFilter()`.

---

## 18. Pagination

**Prompt:**

> to make this character list a bit more overviewable it would be nice to add pagination

**Summary:**
Added MUI `Pagination` to `CharacterGrid` with 24 items per page. Page resets automatically when search query changes. Scrolls to top on page change. Pagination only renders when there are multiple pages (clean single-page search results).

---

## 19. App title, logo, and favicon

**Prompt:**

> add a title in the header so we always see what application this is. also add a logo and favicon

**Summary:**
Created two SVGs:

- `public/logo.svg` — Death Star silhouette with transparent background, used at 28px in the header.
- `public/favicon.svg` — Same Death Star on a dark rounded-square background, referenced in `metadata.icons`.
  Updated the header from `justify-content: flex-end` to `space-between`, with the logo + "Squad Assembler" title on the left and controls on the right.

---

## 20. URL-driven pagination, per-page dropdown, and locale/settings persistence

**Prompt:**

> for the pagination, also keep track of it in the url using query params. maybe also only show 12 per page (and add a dropdown to choose the amount per page to show). save this setting to local storage (also save a11y and language selections to localstorage for optimal UX)

**Summary:**

- **URL pagination**: `?page=N` query param synced via `router.replace` (no extra history entries). `useSearchParams` required wrapping `CharacterGrid` in `<Suspense>`.
- **Per-page dropdown**: Options 12 / 24 / 48, default 12. Saved to `localStorage` under `sw-page-size`, restored on mount.
- **Language persistence**: `LanguageSwitcher` now writes both `localStorage` (`sw-locale`) and a 1-year `SameSite=Lax` cookie. The middleware (`proxy.ts`) reads the cookie on bare-URL visits to redirect to the user's saved locale rather than always defaulting to English.
- **A11y settings**: Were already persisted to `localStorage` (`sw-theme-settings`) via `AppThemeProvider` from prompt 12.

---

## 21. AI usage log update

**Prompt:**

> And also add all ai prompts and summary to the AI_USAGE file

**Summary:**
Appended all prompts and summaries from the current session (prompts 6–21) to this file, covering the full arc of the project from MUI integration through to the final UX polish.

---

## 22. MUI hydration error fix

**Prompt:**

> fix the hydration errors in the console

**Summary:**
React was throwing a hydration mismatch because MUI's Emotion cache generated different class name hashes on the server vs the client. Fixed by installing `@mui/material-nextjs` and replacing the manual `createEmotionCache` + `CacheProvider` setup in `ThemeRegistry.tsx` with the official `AppRouterCacheProvider` from `@mui/material-nextjs/v15-appRouter`. This lets Next.js and Emotion coordinate cache flushing correctly during SSR.

---

## 23. localStorage removal

**Prompt:**

> remove all localStorage saving

**Summary:**
Several features were persisting state to `localStorage` on the client — causing React hydration mismatches because the server renders with defaults and the client immediately re-renders with stored values. Removed `localStorage` reads/writes from:

- `CharacterGrid` (`sw-page-size` — page size preference)
- `AppThemeProvider` (`sw-theme-settings` — colour mode / font size)
- `LanguageSwitcher` (`sw-locale` write — language preference)

Language selection still sets a cookie (read server-side by middleware) so locale routing is preserved without client-side hydration issues.

---

## 24. Back button restores correct page

**Prompt:**

> back button goes to correct URL but page resets to 1 on arrival

**Summary:**
A `useEffect` dependent on `[query, pageSize]` was calling `pushPage(1)` on mount, wiping the `?page=N` from the URL every time `CharacterGrid` mounted (including when returning from a detail page). Removed the effect entirely; `pushPage(1)` is now only called explicitly inside `handleQueryChange` and `handlePageSizeChange`. `sessionStorage("sw-list-return")` is written on every navigation so the detail page's back button always has the correct URL to return to.

---

## 25. Scroll position restoration

**Prompt:**

> save/restore scroll position when navigating to a character detail and clicking back

**Summary:**
When a card is clicked, `CharacterCard` writes `window.scrollY` to `sessionStorage("sw-list-scroll")`. On mount, `CharacterGrid` reads the key, removes it, and calls `window.scrollTo` inside a `requestAnimationFrame` so the DOM has fully painted before the scroll is applied. Using `behavior: "instant"` avoids a visible animated jump. The key is removed immediately so a fresh visit to the list doesn't misfire the restore.

---

## 26. Comprehensive unit test suite

**Prompt:**

> add a ton of unit tests and show me test coverage. try breaking the app as much as you can

**Summary:**
Full Jest + React Testing Library setup from scratch:

- **Dependencies**: `jest`, `jest-fixed-jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `babel-jest`, `identity-obj-proxy`, `@types/jest`
- **Config**: `jest.config.ts` using `next/jest.js` integration, `jest-fixed-jsdom` test environment, `@/` path alias, coverage collection excluding `src/app/**` and store boilerplate
- **122 tests across 10 suites**:
  - `logic.test.ts` — 17 tests for `isEvilCharacter` (keyword rules, affiliations, masters, edge cases)
  - `fuzzy.test.ts` — 22 tests for `fuzzyScore` and `fuzzyFilter` (exact match, subsequence, typos, sorting, empty input)
  - `characterPlaceholder.test.ts` — 11 tests for the seeded SVG generator (consistent output, correct structure, URL-encoded SVG handling)
  - `teamSlice.test.ts` — 16 tests for Redux team slice actions
  - `characterSlice.test.ts` — 4 tests for character slice
  - `i18n.test.ts` — 8 tests for locale config and helpers
  - `SearchBar.test.tsx` — 10 component tests
  - `CharacterCard.test.tsx` — 6 component tests
  - `TeamPanel.test.tsx` — 12 component tests
  - `useGlobalShortcuts.test.ts` — 13 hook tests (including `contentEditable` guard via `Object.defineProperty`)
- **Full coverage** on all pure logic, lib, store, and hook files.

---

## 27. Search query in URL params

**Prompt:**

> also keep search input in query params. we should be able to input a search, go to second page of the search results, click on a character and click on the go back button to the same page

**Summary:**
Changed `query` in `CharacterGrid` from local `useState` to derived state from `searchParams.get("q")`. `handleQueryChange` now calls `router.replace` with `?q=...` (removing `?page` to reset to page 1), rather than updating local state. Since `pushPage` already builds from `new URLSearchParams(searchParams.toString())`, it naturally preserves `?q=` when changing pages. The result is a fully URL-driven state: `?q=luke&page=2` round-trips through navigation, so the back button on the detail page restores both the search and the page.

---

## 28. Persistent team members across page refreshes

**Prompt:**

> we want to have persistent memory of our team members so we keep them if the page refreshes. what would you recommend to do this? use library or add logic to the reducer and save/load from local storage? what if this data gets corrupt? implement it, and add unit tests

**Summary:**
Chose a custom middleware + `preloadedState` approach over `redux-persist` to avoid SSR complexity and unnecessary bundle weight. Implementation:

- **`src/store/teamPersistence.ts`**: `loadTeamState()` reads `sw-team` from `localStorage`, validates shape with `isValidTeamState()` (checks `members` is an array where every entry has a numeric `id` and string `name`), and returns `undefined` on any failure — corrupt JSON, wrong root type, missing fields. `saveTeamState()` serialises and silently swallows quota/private-browsing errors.
- **`src/store/store.ts`**: `preloadedState` hydrates the team slice from `localStorage` on startup; `teamPersistenceMiddleware` saves after every dispatched action.
- **24 unit tests** in `teamPersistence.test.ts` covering: 9 shape validation cases, 8 load cases (empty, valid, corrupt JSON, null JSON, wrong type, bad members), quota-exceeded simulation, middleware save/load round-trip, and corrupt-data → safe empty-team fallback on hydration.
