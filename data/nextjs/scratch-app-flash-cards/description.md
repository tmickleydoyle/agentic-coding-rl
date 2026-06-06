# Flash Cards App

A multi-route flash card application for studying with decks of cards.

## Routes
- **Home** (`/`): Dashboard showing deck count, total cards, and a "Start Studying" button.
- **Decks** (`/decks`): List decks with CRUD. Each deck has: id, name, description. Can add cards to a deck from this page.
- **Study** (`/study`): Pick a deck, then flip through cards one at a time. Show front side; click "Flip" to reveal back. Buttons: "Know It" (correct) and "Don't Know" (incorrect). Track session: cardsStudied, correct, incorrect.
- **Progress** (`/progress`): Shows per-deck stats: total cards, and last session results (correct/incorrect/cardsStudied).

## Seed Data
Decks: `[{ id: "d1", name: "Spanish Basics", description: "Common Spanish words" }, { id: "d2", name: "History Dates", description: "Key historical events" }]`
Cards: `[{ id: "c1", deckId: "d1", front: "Hola", back: "Hello" }, { id: "c2", deckId: "d1", front: "Gracias", back: "Thank you" }, { id: "c3", deckId: "d2", front: "1776", back: "US Independence" }]`

## Behaviors
- Adding a deck requires a non-empty name.
- Adding a card requires non-empty front and back text and a valid deckId.
- Deleting a deck also deletes all its cards.
- Study mode: user selects a deck, then sees cards sequentially. After all cards are reviewed, show a summary (correct/incorrect).
- Progress page shows stats per deck.

## API
`GET /api/cards?deckId=<id>` → returns `{ cards: Card[] }` filtered by deckId
`POST /api/cards` body `{ deckId, front, back }` → returns `{ card: Card }`
`DELETE /api/cards?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Empty deck in study mode: show "No cards in this deck".
- Study mode marks each card only once per session.
- Progress with no sessions: show 0s.
