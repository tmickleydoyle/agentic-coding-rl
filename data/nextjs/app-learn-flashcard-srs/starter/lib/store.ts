import type { Card, Deck, Grade } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `decks`; seed from seedDecks(); provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listDecks(): Deck[] {
  // TODO: return all decks
  return []
}

export function findDeck(_id: string): Deck | undefined {
  // TODO: look up a deck by id
  return undefined
}

export function dueCards(_deck: Deck): Card[] {
  // TODO: return cards with dueDay <= TODAY
  return []
}

export function addCard(_deckId: string, _input: { front: string; back: string }): Card | undefined {
  // TODO: append a card due today with a fresh id; undefined if deck missing
  return undefined
}

export function gradeCard(_deckId: string, _cardId: string, _grade: Grade): Card | undefined {
  // TODO: reschedule the card (lib/srs reschedule) and return it; undefined if missing
  return undefined
}
