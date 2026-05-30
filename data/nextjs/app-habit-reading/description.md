# Habit Reading app

Build a small multi-route reading-habit tracker. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

A fixed `TODAY = '2026-05-28'` constant is used (no real clock).

## Types — `lib/types.ts`
- `ReadLog = { id: string; date: string; pages: number }`
- `Book = { id: string; title: string; done: boolean }`
- `Route = 'today' | 'books' | 'log' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/ReadingProvider.tsx`
Context provider + `useReading()` hook that throws if used outside the provider. Exposes:
- `logs: ReadLog[]`, `books: Book[]`, `theme`, `route`, `today: string`
- `logPages({ date, pages })` — **upsert** by date (replace pages, otherwise append, fresh id
  `l4`, `l5`, …).
- `removeLog(id)`, `toggleBook(id)` (flip a book's `done`), `setTheme`, `navigate`

Seed logs (`today` is `'2026-05-28'`):
- `l1` 2026-05-26 pages 30
- `l2` 2026-05-27 pages 45
- `l3` 2026-05-28 pages 20
Seed books:
- `b1` "Dune" done
- `b2` "1984" not done
- `b3` "Hyperion" done
The first newly-created log gets id `l4`.

## Helper — `hooks/useReadingStats.ts`
- `sortedDesc(logs)` — most-recent-first by date.
- `totalPages(logs)` — sum of pages.
- `readingStreak(logs, today)` — consecutive days (ending at `today`, or the day before if
  `today` has no log) with a log whose `pages > 0`. Stop at the first gap.
- `averagePages(logs)` — rounded `totalPages / logs.length`; 0 if empty.
- `booksFinished(books)` — count of `done` books.
- `useReadingStats()` returns `{ total, streak, average, finished, sorted }`.

For the seed: total `95`, streak `3` (05-26,27,28 all > 0, ending today), average `32`
(95/3 = 31.67 → 32), finished `2` (b1, b3).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<ReadingProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-today | nav-books | nav-log | nav-stats`.
Current route's button has `aria-current="page"`.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows `today-date`, `today-pages` (pages logged for today, 0 if none), `today-streak`
(current streak), and `today-logged` (`data-logged="true|false"`).

### `app/books/page.tsx` — `data-testid="page-books"`
`book-list` of `<li data-testid="book-<id>" data-done>` each with `book-<id>-title` and a
`toggle-book-<id>` button. `books-finished` shows the finished count. Empty → 
`<p data-testid="empty-state">`.

### `app/log/page.tsx` — `data-testid="page-log"`
A `<form data-testid="log-form">` with `pages-input` and `submit-pages`: invalid/blank/
negative (or NaN) → `<p data-testid="form-error">` and stay; otherwise
`logPages({ date: today, pages })`, clear, navigate to `today`. Below the form, a
`log-list` of `LogRow`s (sorted desc), each with a `remove-<id>` button; empty → 
`<p data-testid="empty-state">`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
StatCards `stat-total-value`, `stat-streak-value`, `stat-average-value`, `stat-finished-value`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/LogRow.tsx` — `<li data-testid="log-<id>">` with `log-<id>-date`,
  `log-<id>-pages`, and a `remove-<id>` button.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/logs/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON sets `content-type: application/json`.
- **GET** — `{ logs, books }`.
- **POST** — body `{ date, pages }`. Upsert by date. 201 with the log. Blank date → 400
  `{ error: "date required" }`. Pages not a non-negative number → 400
  `{ error: "pages invalid" }`. New ids `l4`, ….
- **PUT** — body `{ id }`. Toggle that book's `done`. 200 with the book. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. Delete a log. 200 `{ ok: true }`. Unknown id → 404
  `{ error: "not found" }`.
