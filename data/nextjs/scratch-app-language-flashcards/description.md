# Language Flashcards

A single-page React app for language learning with flashcard decks, study sessions, and progress statistics.

## Routes / Pages

- **Home** (`home`): Dashboard — total decks, total cards across all decks, total review sessions completed.
- **Decks** (`decks`): Manage flashcard decks. Each deck: name, language (string), cardCount (derived from cards array). Add deck (name, language). Delete deck (removes all its cards). Add card to deck: front (term), back (definition). Delete card from deck.
- **Study** (`study`): Study mode. Select a deck from dropdown. Show current card front. Toggle to reveal back. Navigate next/previous. Mark card as known (tracks per-session). Show progress: known/total for the selected deck's cards.
- **Stats** (`stats`): Per-deck stats: total cards, sessions completed, known cards count from last session.

## Seed Data

- Deck: `{ id: "d1", name: "Spanish Basics", language: "Spanish" }`
- Deck: `{ id: "d2", name: "French Colors", language: "French" }`
- Card: `{ id: "c1", deckId: "d1", front: "Hello", back: "Hola" }`
- Card: `{ id: "c2", deckId: "d1", front: "Thank you", back: "Gracias" }`
- Card: `{ id: "c3", deckId: "d2", front: "Red", back: "Rouge" }`
- Session: none initially (sessionsCompleted starts at 0 per deck).

## Behaviors

- In Study: selecting a deck loads its cards; currentIndex starts at 0; flipped starts as false.
- "Next" increments currentIndex (wraps to 0 at end). "Prev" decrements (wraps to last card).
- "Mark Known" adds current card id to a known set for the session.
- "Flip" toggles showing front vs back.
- Sessions completed per deck increments when user clicks "End Session".
- NavBar: Home, Decks, Study, Stats. Active route `data-active="true"`.

## API Routes

`/api/decks` — GET all decks with cards; POST create deck `{ name, language }`; DELETE `?id=` (removes deck and its cards).

## Data-testids

- `nav-home`, `nav-decks`, `nav-study`, `nav-stats`
- `dashboard-deck-count`, `dashboard-card-count`, `dashboard-session-count`
- `deck-list`, `deck-item`, `deck-add-form`, `deck-name-input`, `deck-lang-input`, `deck-submit`, `deck-delete`
- `card-add-form`, `card-front-input`, `card-back-input`, `card-submit`, `card-list`, `card-item`, `card-delete`
- `study-deck-select`, `study-card-front`, `study-card-back`, `study-flip`, `study-next`, `study-prev`, `study-mark-known`, `study-end-session`, `study-progress`
- `stats-list`, `stats-item`
