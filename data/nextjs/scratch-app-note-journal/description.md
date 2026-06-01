> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Journal app

Build a small multi-route daily-journal app. Each entry has a date, body, and a mood tag.
Routing is **in-app** (React state — no `next` imports anywhere). Four routes, a shared
Context, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Mood = 'happy' | 'neutral' | 'sad'`
- `Entry = { id: string; date: string; body: string; mood: Mood }` (date is `YYYY-MM-DD`)
- `Route = 'today' | 'entries' | 'new' | 'insights'`
- `Theme = 'light' | 'dark'`

The app's "today" is a fixed constant `TODAY = '2026-05-29'` exported from `lib/types.ts`
(deterministic for tests).

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `entries: Entry[]`, `theme: Theme`, `route: Route`
- `moodFilter: Mood | 'all'` — active mood filter on the entries list
- `addEntry({ date?, body, mood })` — appends an `Entry` (date defaults to `TODAY`, fresh
  id `e4`, `e5`, …), returns it
- `updateEntry(id, { body?, mood? })` — patches an entry
- `removeEntry(id)` — drops an entry
- `setMoodFilter`, `setTheme`, `navigate(route)`

Seed data (3 entries):

| entry | id | date | mood |
|---|---|---|---|
| (Shipped the build) | `e1` | `2026-05-27` | happy   |
| (Quiet day)         | `e2` | `2026-05-28` | neutral |
| (Long meetings)     | `e3` | `2026-05-28` | sad     |

The first added entry gets id `e4`.

## Derived helpers — `hooks/useJournal.ts`
Pure helper `moodCounts(entries)` returning `{ happy: number; neutral: number; sad: number;
total: number }`. A `useJournal()` hook returning:
- `sortedEntries` — `entries` sorted by `date` **descending** (newest first); stable within
  a date.
- `filteredEntries` — `sortedEntries` after `moodFilter` (when not `'all'`).
- `todaysEntries` — entries whose `date === TODAY`.
- `counts` — `moodCounts(entries)`.
- `topMood` — the mood with the highest count (ties broken by the order
  happy > neutral > sad), or `null` when there are no entries.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-today" | "nav-entries" | "nav-new" | "nav-insights"` (labels
Today / Entries / New / Insights). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows `<p data-testid="today-date">` with `TODAY`, and today's entries as
`<ul data-testid="today-list">` of `<li data-testid="today-<id>">` (with `today-<id>-mood`).
When there are none, render `<p data-testid="today-empty">` and no list. A `quick-new`
button navigates to `new`.

### `app/entries/page.tsx` — `data-testid="page-entries"`
A `mood-filter` `<select>` (options `all`, `happy`, `neutral`, `sad`), then
`filteredEntries` newest-first. Each row is `<li data-testid="entry-<id>"
data-mood="<mood>">` with `entry-<id>-date`, `entry-<id>-body`, a `mood-<id>` button that
cycles the mood happy→neutral→sad→happy via `updateEntry`, and a `delete-<id>` button. When
none match, render `<p data-testid="entries-empty">` and no `entry-list`; otherwise wrap
rows in `<ul data-testid="entry-list">`.

### `app/new/page.tsx` — `data-testid="page-new"`
`<form data-testid="entry-form">` with `date-input` (type date, prefilled with `TODAY`),
`body-input` (textarea), a `mood-select` (`happy`/`neutral`/`sad`), and `save-entry`. On
submit: if `body` is empty/whitespace, render `<p data-testid="form-error">` and stay.
Otherwise `addEntry` and `navigate('entries')`.

### `app/insights/page.tsx` — `data-testid="page-insights"`
Mood summary: `<p data-testid="count-happy">`, `count-neutral`, `count-sad`,
`count-total` (numbers from `counts`), and `<p data-testid="top-mood">` showing `topMood`
(text `none` when there are no entries).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/entries/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ entries: Entry[] }`. Optional `?mood=<mood>` and `?date=<YYYY-MM-DD>`
  filters (AND). If `?summary=1` is present, instead return
  `{ summary: { happy, neutral, sad, total } }` (computed over all entries, ignoring other
  filters).
- **POST** — body `{ body, mood?, date? }`. 201 with the created entry. If `body` is
  missing/blank → 400 `{ error: "body required" }`. `mood` defaults to `neutral`; `date`
  defaults to `TODAY`. New ids continue `e4`, `e5`, …
- **PUT** — `?id=<id>`. Body `{ body?, mood? }` patch. Returns the updated entry. Unknown
  id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
