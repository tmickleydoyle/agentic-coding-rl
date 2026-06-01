> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Habit Mood app

Build a small multi-route daily mood-logging app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

A fixed `TODAY = '2026-05-28'` constant is used (no real clock). Mood `score` is 1–5.

## Types — `lib/types.ts`
- `MoodEntry = { id: string; date: string; score: number; triggers: string[] }`
- `Route = 'today' | 'history' | 'add' | 'insights'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/MoodProvider.tsx`
Context provider + `useMood()` hook that throws if used outside the provider. Exposes:
- `entries: MoodEntry[]`, `theme`, `route`, `today: string`
- `logMood({ date, score, triggers })` — **upsert** by date: replace an existing date's
  score+triggers, otherwise append (fresh id `m4`, `m5`, …). `triggers` defaults to `[]`.
- `removeEntry(id)`, `setTheme`, `navigate`

Seed entries (`today` is `'2026-05-28'`):
- `m1` 2026-05-25 score 4 triggers `['sleep']`
- `m2` 2026-05-26 score 2 triggers `['work','stress']`
- `m3` 2026-05-27 score 5 triggers `['exercise']`
The first newly-created entry gets id `m4`.

## Helper — `hooks/useMoodInsights.ts`
- `sortedDesc(entries)` — most-recent-first by date.
- `averageScore(entries)` — mean score rounded to 1 decimal (e.g. `3.7`); `0` if empty.
- `bestEntry(entries)` — the entry with the highest score (ties: earliest date). `null` if
  empty.
- `triggerCounts(entries)` — `Record<string, number>` of trigger → occurrences.
- `topTrigger(entries)` — the most frequent trigger string (ties: alphabetical); `null` if
  none.
- `trend(entries)` — compare the average of the most-recent half to the earlier half (split
  by date order, recent half is the later dates). Returns `'up' | 'down' | 'flat'`. With <2
  entries → `'flat'`. (Odd counts: the middle entry goes to the earlier half.)
- `useMoodInsights()` returns `{ average, best, top, trend, sorted, count }`.

For the seed (by date 05-25→4, 05-26→2, 05-27→5): average `3.7`, best is `m3` (5),
top trigger `'exercise'` (all count 1; alphabetical first among exercise/sleep/stress/work),
trend: earlier half [4,2] avg 3, recent half [5] avg 5 → `'up'`, count `3`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<MoodProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-today | nav-history | nav-add | nav-insights`.
Current route's button has `aria-current="page"`.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows `today-date`, `today-score` (today's logged score, or `-` if none), and
`today-logged` (`data-logged="true|false"`). If logged, list today's triggers in
`today-triggers`.

### `app/history/page.tsx` — `data-testid="page-history"`
`entry-list` of `MoodRow`s sorted most-recent-first; empty → `<p data-testid="empty-state">`.

### `app/add/page.tsx` — `data-testid="page-add"`
A `<form data-testid="add-form">` with `score-input` (number text), `triggers-input` (comma
separated), and `submit-mood`. Score not in 1–5 (or blank/NaN) → `<p data-testid="form-error">`
and stay; otherwise `logMood({ date: today, score, triggers })` (triggers split on commas,
trimmed, empties dropped), clear, navigate to `today`.

### `app/insights/page.tsx` — `data-testid="page-insights"`
StatCards `stat-average-value`, `stat-best-value` (best entry's score, or `-`),
`stat-top-value` (top trigger, or `-`), `stat-trend-value` (the trend string), and
`stat-count-value`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/MoodRow.tsx` — `<li data-testid="entry-<id>" data-score={score}>` with
  `entry-<id>-date`, `entry-<id>-score`, `entry-<id>-triggers` (joined by `', '`), and a
  `remove-<id>` button.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/moods/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON sets `content-type: application/json`.
- **GET** — `{ entries }`.
- **POST** — body `{ date, score, triggers? }`. Upsert by date. 201 with the entry. Blank
  date → 400 `{ error: "date required" }`. Score not a number in 1–5 → 400
  `{ error: "score invalid" }`. New ids `m4`, …. `triggers` defaults to `[]`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
