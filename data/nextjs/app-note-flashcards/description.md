# Flashcards app

Build a small multi-route flashcards app: decks of cards with a study mode. Routing is
**in-app** (React state — no `next` imports anywhere). Four routes, a shared Context, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Card = { id: string; deckId: string; front: string; back: string; known: boolean }`
- `Deck = { id: string; name: string }`
- `Route = 'decks' | 'study' | 'add' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `decks: Deck[]`, `cards: Card[]`, `theme: Theme`, `route: Route`
- `selectedDeckId: string | null` — the deck being studied / added to
- `studyIndex: number` — index into the current deck's cards while studying
- `flipped: boolean` — whether the current study card shows its back
- `addCard({ deckId, front, back })` — appends a `Card` (`known: false`, fresh id
  `c5`, `c6`, …), returns it
- `markKnown(id, known)` — sets a card's `known` flag
- `flip()` — toggles `flipped`
- `nextCard()` — advances `studyIndex` (clamped to the last card) and resets `flipped` to
  false
- `resetDeck(deckId)` — sets every card in the deck back to `known: false`
- `studyDeck(id)` — sets `selectedDeckId`, `studyIndex = 0`, `flipped = false`, and
  navigates to `study`
- `startAddCard(deckId)` — sets `selectedDeckId` + navigates to `add`
- `setTheme`, `navigate(route)`

Seed data (2 decks, 4 cards):

| deck | id |
|---|---|
| Spanish | `d1` |
| Capitals| `d2` |

| card | id | deck | front | back | known |
|---|---|---|---|---|---|
| hola    | `c1` | `d1` | hola    | hello  | false |
| gato    | `c2` | `d1` | gato    | cat    | true  |
| France  | `c3` | `d2` | France  | Paris  | false |
| Japan   | `c4` | `d2` | Japan   | Tokyo  | false |

The first added card gets id `c5`.

## Derived helpers — `hooks/useDeck.ts`
Pure helper `deckProgress(cards, deckId)` returning
`{ total: number; known: number; remaining: number }`. A `useDeck()` hook returning:
- `deckCards` — cards whose `deckId === selectedDeckId` (in array order)
- `currentCard` — `deckCards[studyIndex]` or `null`
- `progress` — `deckProgress(cards, selectedDeckId)` (zeros when no deck selected)

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`decks`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-decks" | "nav-study" | "nav-add" | "nav-stats"` (labels
Decks / Study / Add / Stats). The current route's button has `aria-current="page"`; others
must **not**.

## Pages
### `app/decks/page.tsx` — `data-testid="page-decks"`
A `<ul data-testid="deck-list">` of decks. Each is `<li data-testid="deck-<id>">` with
`deck-<id>-name`, a `deck-<id>-count` (number of cards in the deck), a `study-<id>` button
(calls `studyDeck`), and an `add-<id>` button (calls `startAddCard`).

### `app/study/page.tsx` — `data-testid="page-study"`
If no deck selected, render `<p data-testid="no-deck">`. Otherwise show the current card:
`<div data-testid="study-card" data-flipped="true|false">` containing
`<p data-testid="card-face">` whose text is the card's `back` when `flipped` else its
`front`. Buttons: `flip-card` (calls `flip`), `mark-known` (calls
`markKnown(currentCard.id, true)`), `mark-unknown` (calls `markKnown(currentCard.id,
false)`), and `next-card` (calls `nextCard`). Also `<p data-testid="study-progress">` with
text `"<known>/<total>"` from `progress`. When the deck has no cards, render
`<p data-testid="study-empty">` instead of the card.

### `app/add/page.tsx` — `data-testid="page-add"`
If no deck selected, render `<p data-testid="no-deck">`. Otherwise
`<form data-testid="card-form">` with `front-input`, `back-input`, and `save-card`. On
submit: if `front` OR `back` is empty/whitespace, render `<p data-testid="form-error">` and
stay. Otherwise `addCard` into `selectedDeckId` and `navigate('study')`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
For each deck render `<li data-testid="stat-<id>">` with `stat-<id>-known` and
`stat-<id>-total` from `deckProgress`. Also a `reset-<id>` button that calls
`resetDeck(id)`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/decks/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ cards: Card[] }`. Optional `?deckId=<id>` and `?known=true|false` filters
  (AND).
- **POST** — body `{ deckId, front, back }`. 201 with the created card. If `front` or
  `back` is missing/blank → 400 `{ error: "front and back required" }`. New ids continue
  `c5`, `c6`, …
- **PUT** — `?id=<id>`. With body `{ known: boolean }` set it; with no `known` key, toggle.
  Returns the updated card. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
