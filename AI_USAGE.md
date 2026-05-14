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
