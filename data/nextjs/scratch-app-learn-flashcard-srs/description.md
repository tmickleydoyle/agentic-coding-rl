> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Learn Flashcard SRS app

Build a small multi-route spaced-repetition flashcard app. Routing is **in-app** (React
state — no `next` imports anywhere). Four routes, a shared Context holding all cross-route
state, and one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

Time is modeled as an integer **day index** (no real dates). "Today" is a fixed `TODAY`
constant = `0`. A card is **due** when `dueDay <= TODAY`. Grading reschedules a card:
- `hard` → `interval = 1`, `dueDay = TODAY + 1`
- `easy` → `interval = max(1, prevInterval) * 2`, `dueDay = TODAY + interval`

## Types — `lib/types.ts`
- `Grade = 'easy' | 'hard'`
- `Card = { id: string; front: string; back: string; dueDay: number; interval: number }`
- `Deck = { id: string; name: string; cards: Card[] }`
- `Route = 'decks' | 'review' | 'add-card' | 'stats'`
- `Theme = 'light' | 'dark'`
- export `TODAY = 0`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `decks: Deck[]`, `theme: Theme`, `route: Route`
- `activeDeckId: string | null` — deck being reviewed / added to
- `openDeck(deckId)` — set `activeDeckId`, navigate to `review`
- `gradeCard(deckId, cardId, grade)` — reschedule that card per the rules above
- `addCard(deckId, { front, back })` — append a card to the deck, due today
  (`dueDay = TODAY`, `interval = 0`), fresh id like `<deckId>-cN`
- `setActiveDeck(deckId)` — set `activeDeckId` without navigating
- `setTheme`, `navigate(route)`

Seed data (2 decks):
- `d1` "Spanish" cards:
  - `d1-c1` front "hola" back "hello" dueDay 0 interval 1
  - `d1-c2` front "gato" back "cat" dueDay 0 interval 2
  - `d1-c3` front "perro" back "dog" dueDay 3 interval 4 (NOT due today)
- `d2` "Capitals" cards:
  - `d2-c1` front "France" back "Paris" dueDay 0 interval 1

The first card added to `d1` gets id `d1-c4`; to `d2` gets `d2-c2`.

## Optional helper — `hooks/useSrs.ts`
Pure helpers: `dueCards(deck)` → cards with `dueDay <= TODAY`. `reschedule(card, grade)` →
a new card with updated `dueDay`/`interval` per the rules. `findDeck(decks, id)` returns the
deck or `undefined`. A `useActiveDeck()` hook returns `{ deck, due }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `decks`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` four buttons: `nav-decks | nav-review | nav-add-card |
nav-stats` (labels Decks / Review / Add Card / Stats). Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/decks/page.tsx` — `data-testid="page-decks"`
Lists decks. Each `<li data-testid="deck-<id>">` with `deck-<id>-name`, a `deck-<id>-due`
showing the number of due cards, a `deck-<id>-total` showing total cards, and a
`review-<id>` button calling `openDeck(id)`.

### `app/review/page.tsx` — `data-testid="page-review"`
If no `activeDeckId`, render `<p data-testid="no-deck">`. Otherwise compute the due cards.
If there are none, render `<p data-testid="all-done">`. Otherwise show the **first** due
card: `<div data-testid="current-card">` with `card-front` (the front). A `show-back`
button toggles a `card-back` element (the back) into view (hidden until shown). Two
buttons `grade-easy` and `grade-hard` call `gradeCard(activeDeckId, currentCard.id, ...)`.
After grading, the next due card (if any) becomes current and the back is hidden again.

### `app/add-card/page.tsx` — `data-testid="page-add-card"`
A `<form data-testid="add-card-form">` with a `deck-select` (one option per deck, value =
deck id, defaulting to `activeDeckId` if set else the first deck), `front-input`,
`back-input`, and `submit-card`. On submit: if either field is empty/whitespace, render
`<p data-testid="form-error">` and stay. Otherwise `addCard(...)`, clear the inputs, and
navigate to `decks`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
Aggregate stats across all decks: `total-cards-value` (sum of all cards),
`due-today-value` (cards due today across all decks), and a per-deck breakdown list where
each deck is `<li data-testid="stat-deck-<id>">` with a `stat-deck-<id>-due` value.

## Presentational components
- `components/DeckCard.tsx` — the `deck-<id>` decks-page row.
- `components/CardFace.tsx` — the `current-card` block on the review page (front, optional
  back, show-back + grade buttons).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/decks/route.ts`
- **GET** — `{ decks: Deck[] }`. With `?id=<id>` → `{ deck }` or 404 `{ error: "not
  found" }`. With `?id=<id>&due=1` → `{ cards }` of just the due cards for that deck.
- **POST** — `?id=<id>` body `{ front, back }` — add a card; 201 with the created card.
  Unknown deck → 404 `{ error: "not found" }`. Blank front/back → 400 `{ error: "front
  and back required" }`.
- **PUT** — `?id=<id>&cardId=<cid>` body `{ grade }` — reschedule the card; returns the
  updated card. Unknown deck or card → 404 `{ error: "not found" }`. Invalid grade → 400
  `{ error: "invalid grade" }`.
