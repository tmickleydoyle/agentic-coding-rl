import type { Card, Deck } from './types'

let decks: Deck[] = []
let cards: Card[] = []
let nextId = 1

function seed(): void {
  decks = [
    { id: 'd1', name: 'Spanish' },
    { id: 'd2', name: 'Capitals' },
  ]
  cards = [
    { id: 'c1', deckId: 'd1', front: 'hola', back: 'hello', known: false },
    { id: 'c2', deckId: 'd1', front: 'gato', back: 'cat', known: true },
    { id: 'c3', deckId: 'd2', front: 'France', back: 'Paris', known: false },
    { id: 'c4', deckId: 'd2', front: 'Japan', back: 'Tokyo', known: false },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listCards(filter?: { deckId?: string | null; known?: string | null }): Card[] {
  let out = cards.slice()
  const deckId = filter?.deckId
  if (deckId) out = out.filter((c) => c.deckId === deckId)
  const known = filter?.known
  if (known === 'true') out = out.filter((c) => c.known)
  else if (known === 'false') out = out.filter((c) => !c.known)
  return out
}

export function createCard(input: { deckId?: string; front: string; back: string }): Card {
  const card: Card = {
    id: `c${nextId++}`,
    deckId: input.deckId ?? 'd1',
    front: input.front,
    back: input.back,
    known: false,
  }
  cards.push(card)
  return card
}

export function findCard(id: string): Card | undefined {
  return cards.find((c) => c.id === id)
}

export function updateCard(id: string, patch: { known?: boolean }): Card | undefined {
  const card = cards.find((c) => c.id === id)
  if (!card) return undefined
  if (typeof patch.known === 'boolean') card.known = patch.known
  return card
}

export function deleteCard(id: string): boolean {
  const idx = cards.findIndex((c) => c.id === id)
  if (idx === -1) return false
  cards.splice(idx, 1)
  return true
}

export function listDecks(): Deck[] {
  return decks.slice()
}
