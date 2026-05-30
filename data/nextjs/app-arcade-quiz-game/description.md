# Arcade Quiz Game app

A trivia quiz with rounds, scoring, a leaderboard and categories. Routing is **in-app**
(React state — no `next` imports anywhere). Four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Question = { id: string; category: string; prompt: string; choices: string[];
  answer: number }` (`answer` indexes `choices`)
- `QuizState = { questionIds: string[]; index: number; score: number; answers: number[];
  done: boolean }`
- `Route = 'play' | 'results' | 'leaderboard' | 'categories'`
- `Theme = 'light' | 'dark'`

## Question bank + pure logic — `lib/quiz.ts` (unit-tested directly)
Export a constant `QUESTIONS: Question[]` (fixed order):
| id | category | prompt | choices | answer |
|---|---|---|---|---|
| q1 | Geography | Capital of France? | [Paris, Rome, Berlin] | 0 |
| q2 | Geography | Largest ocean? | [Atlantic, Pacific, Indian] | 1 |
| q3 | Science | Symbol for water? | [CO2, O2, H2O] | 2 |
| q4 | Science | Planets in the solar system? | [7, 8, 9] | 1 |
| q5 | Math | 6 × 7? | [42, 36, 48] | 0 |
| q6 | Math | Square root of 81? | [7, 8, 9] | 2 |

Helpers:
- `categories(): string[]` — distinct categories in first-seen order
  (`['Geography','Science','Math']`).
- `questionsByCategory(category: string | null): Question[]` — questions for a category, or
  **all** when `category` is `null`.
- `startQuiz(category: string | null): QuizState` — `{ questionIds, index: 0, score: 0,
  answers: [], done: false }` using `questionsByCategory`. If there are no questions, `done`
  is `true`.
- `answer(state, choice, bank): QuizState` — record `choice` for the current question. If the
  choice equals the question's `answer`, add 10 to `score`. Advance `index`; when past the
  last question, set `done: true`. If the quiz is already `done`, return the same reference.
  `bank` is the `Question[]` to resolve ids against (default `QUESTIONS`).
- `currentQuestion(state, bank): Question | null` — the question at `index`, or `null` when
  `done`/out of range.
- `maxScore(state): number` — `questionIds.length * 10`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `quiz: QuizState`, `category: string | null`, `theme: Theme`, `route: Route`,
  `lastScore: number | null`
- `choose(choice)` — apply `answer(...)`. When the quiz becomes `done`, set `lastScore` to
  the final `score` and navigate to `results`.
- `start(category)` — set `category`, `startQuiz(category)`, navigate to `play`.
- `restart()` — `startQuiz(category)` with the same category and navigate to `play`.
- `setTheme(theme)`, `navigate(route)`.

Initial: `category` null, `quiz = startQuiz(null)` (all 6 questions), `lastScore` null,
`route = 'categories'`.

## Optional helper — `hooks/useQuiz.ts`
Returns `{ current, total, answered, score, done }` where `total` is the number of questions
and `answered` is `quiz.answers.length`. Convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Root element
`<div data-testid="app-root" data-theme={theme}>` with `<NavBar/>` and
`<main data-testid="page-content">`. Starts on `categories`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons
`data-testid="nav-play" | "nav-results" | "nav-leaderboard" | "nav-categories"` (labels
Play / Results / Leaderboard / Categories). Current route button has `aria-current="page"`;
others must **not**.

## Pages
### `app/categories/page.tsx` — `data-testid="page-categories"`
A `<button data-testid="cat-all">` (starts all questions) and one
`<button data-testid="cat-<name>">` per category, each calling `start(...)` (`null` for all).
Show `<span data-testid="cat-count-<name>">` with the number of questions per category.

### `app/play/page.tsx` — `data-testid="page-play"`
Show the current question: `<p data-testid="prompt">`, the `<span data-testid="progress">`
(text `<index+1> / <total>`), and one `<button data-testid="choice-<i>">` per choice (calls
`choose(i)`). Show `<span data-testid="score">`. When the quiz is `done`, render
`<p data-testid="play-done">` instead of a question.

### `app/results/page.tsx` — `data-testid="page-results"`
Show `<span data-testid="final-score">` (the `lastScore`, or `-` when null),
`<span data-testid="max-score">` (max possible for the just-played quiz), and a
`<form data-testid="save-form">` with a `name-input` and `save-score` button that calls
`submit` (see below) then navigates to `leaderboard`. A `<button data-testid="play-again">`
calls `restart`.

### `app/leaderboard/page.tsx` — `data-testid="page-leaderboard"`
List the leaderboard entries (from context `entries`) ranked by score descending as
`<li data-testid="entry-<id>">` with `entry-<id>-name` and `entry-<id>-score`, inside a
`<ul data-testid="entry-list">`. Show `<span data-testid="entry-count">`.

Add to context: `entries: { id: string; name: string; score: number }[]` (client-side,
seeded `e1` Ada/50, `e2` Bo/30) and `submit(name)` which appends an entry
(ids `e3`, `e4`, …) using `lastScore` (treat null as 0) when `name` is non-blank; returns the
new id or `null`. `entries` exposed already ranked by score descending.

## Presentational components
- `components/Choice.tsx` — one answer button.
- `components/EntryRow.tsx` — one leaderboard `<li>`.

## API — separate in-memory store
`lib/store.ts` holds its **own** leaderboard plus a `__reset()`.

`Entry = { id: string; name: string; score: number }`. Seed: `e1` Ada/50, `e2` Bo/30; first
new id `e3`.

### `app/api/scores/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ entries: Entry[] }` ranked by score descending (ties keep insertion order).
- **POST** — body `{ name, score }`. 201 with the created entry (ids `e3`, `e4`, …). If
  `name` missing/blank → 400 `{ error: "name required" }`. If `score` not a finite number
  `>= 0` → 400 `{ error: "bad score" }`.
- **DELETE** — `?id=<entryId>` → 200 `{ ok: true }`; unknown id → 404
  `{ error: "not found" }`.
