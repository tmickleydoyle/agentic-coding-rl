import type { Card, Deck } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `decks`, `cards`, and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCards(_filter?: { deckId?: string | null; known?: string | null }): Card[] {
  // TODO: return cards, applying optional deckId + known filters
  return []
}

export function createCard(_input: { deckId?: string; front: string; back: string }): Card {
  // TODO: append a new card with a fresh id and return it
  return { id: '', deckId: '', front: '', back: '', known: false }
}

export function findCard(_id: string): Card | undefined {
  // TODO: look up a card by id
  return undefined
}

export function updateCard(_id: string, _patch: { known?: boolean }): Card | undefined {
  // TODO: apply the patch and return the updated card, or undefined if absent
  return undefined
}

export function deleteCard(_id: string): boolean {
  // TODO: remove the card; return whether it existed
  return false
}

export function listDecks(): Deck[] {
  // TODO: return all decks
  return []
}
