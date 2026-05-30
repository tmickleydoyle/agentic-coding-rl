# Arcade Leaderboard app

Build a small multi-route arcade leaderboard app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Game = { id: string; name: string }`
- `Score = { id: string; gameId: string; player: string; points: number }`
- `Route = 'games' | 'game-detail' | 'submit' | 'rankings'`
- `Theme = 'light' | 'dark'`

## Pure logic — `lib/leaderboard.ts`
- `rankScores(scores: Score[]): Score[]` — returns a new array sorted by `points`
  descending. Ties keep their original relative order (stable sort).
- `scoresForGame(scores: Score[], gameId: string): Score[]` — ranked scores for one game.
- `topScore(scores: Score[], gameId: string): Score | null` — the single highest score for a
  game, or `null` if the game has none.
- `playerCount(scores: Score[]): number` — number of distinct `player` names across all
  scores.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `games: Game[]`, `scores: Score[]`, `theme: Theme`, `route: Route`,
  `selectedGameId: string | null`
- `submitScore(gameId, player, points)` — appends a `Score` with a fresh id (`s7`, `s8`, …)
  when `gameId` matches a known game, `player` is non-blank, and `points` is a finite number
  `>= 0`; returns the new score id, or `null` when invalid (no append).
- `openGame(gameId)` — sets `selectedGameId` and navigates to `game-detail`.
- `setTheme(theme)`, `navigate(route)`.

Seed games: `g1` "Asteroids", `g2` "Pac-Man", `g3` "Tetris".

Seed scores (id / gameId / player / points):
`s1` g1 Ada 1200, `s2` g1 Bo 900, `s3` g1 Cy 1500, `s4` g2 Ada 300, `s5` g2 Di 500,
`s6` g3 Bo 700.

The first submitted score gets id `s7`.

## Optional helper — `hooks/useLeaderboard.ts`
Derived selectors built on the lib helpers: `ranked` (all scores ranked) and a `stats`
object `{ totalScores, totalGames, players }` where `players` uses `playerCount`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`games`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-games" | "nav-game-detail" | "nav-submit" | "nav-rankings"` (labels
Games / Detail / Submit / Rankings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/games/page.tsx` — `data-testid="page-games"`
List every game via `GameCard` as `<li data-testid="game-<id>">` containing the name
(`game-<id>-name`), a `game-<id>-top` showing the game's top points (or `-` when no scores),
a `game-<id>-count` showing how many scores it has, and an `open-<id>` button (calls
`openGame`). Wrap rows in `<ul data-testid="game-list">`.

### `app/game-detail/page.tsx` — `data-testid="page-game-detail"`
Detail for `selectedGameId`. If none selected, render `<p data-testid="no-game-selected">`.
Otherwise show the game name (`detail-name`) and, for each of that game's ranked scores, a
`<li data-testid="score-<id>">` with rank number (`score-<id>-rank`, 1-based), player
(`score-<id>-player`) and points (`score-<id>-points`), inside a
`<ul data-testid="score-list">`. When the game has no scores, render
`<p data-testid="no-scores">`.

### `app/submit/page.tsx` — `data-testid="page-submit"`
`<form data-testid="submit-form">` with a `<select data-testid="game-select">` (an
`<option>` per game, value = game id), a `player-input`, a `points-input`, and `submit-score`.
On submit: call `submitScore(gameId, player, Number(points))`. If it returns `null`, render
`<p data-testid="submit-error">` and stay. Otherwise `openGame(gameId)` (navigating to the
detail page).

### `app/rankings/page.tsx` — `data-testid="page-rankings"`
A `<select data-testid="filter-select">` with an `All` option (value `all`) plus one option
per game. The list shows the ranked scores for the chosen filter (all scores when `all`),
as `<li data-testid="rank-<id>">` with `rank-<id>-player` and `rank-<id>-points`, inside a
`<ul data-testid="rank-list">`. Also a `<div data-testid="rank-stats">` with `stat-scores`
(total score count) and `stat-players` (distinct player count).

## Presentational components
- `components/GameCard.tsx` — one games-page row (see Games page).
- `components/ScoreRow.tsx` — one ranked `<li>` on the detail page (see Game detail page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/scores/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ scores: Score[] }`. Optional `?gameId=<id>` filters to one game. Optional
  `?sort=rank` sorts (the filtered set) by points descending.
- **POST** — body `{ gameId, player, points }`. 201 with the created score (new ids `s7`,
  `s8`, …). If `gameId` is missing or unknown → 400 `{ error: "bad game" }`. If `player` is
  missing/blank → 400 `{ error: "player required" }`. If `points` is not a finite number
  `>= 0` → 400 `{ error: "bad points" }`.
- **DELETE** — `?id=<scoreId>`. 200 `{ ok: true }`. Unknown id → 404
  `{ error: "not found" }`.
