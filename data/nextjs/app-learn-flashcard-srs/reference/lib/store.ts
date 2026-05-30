import type { Card, Deck, Grade } from './types'
import { TODAY } from './types'
import { seedDecks } from './seed'
import { isDue, reschedule } from './srs'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let decks: Deck[] = []

function seed(): void {
  decks = seedDecks()
}

seed()

export function __reset(): void {
  seed()
}

export function listDecks(): Deck[] {
  return decks.slice()
}

export function findDeck(id: string): Deck | undefined {
  return decks.find((d) => d.id === id)
}

export function dueCards(deck: Deck): Card[] {
  return deck.cards.filter((c) => isDue(c))
}

export function addCard(deckId: string, input: { front: string; back: string }): Card | undefined {
  const deck = decks.find((d) => d.id === deckId)
  if (!deck) return undefined
  let n = deck.cards.length + 1
  while (deck.cards.some((c) => c.id === `${deckId}-c${n}`)) n += 1
  const card: Card = {
    id: `${deckId}-c${n}`,
    front: input.front,
    back: input.back,
    dueDay: TODAY,
    interval: 0,
  }
  deck.cards.push(card)
  return card
}

export function gradeCard(deckId: string, cardId: string, grade: Grade): Card | undefined {
  const deck = decks.find((d) => d.id === deckId)
  if (!deck) return undefined
  const idx = deck.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return undefined
  const updated = reschedule(deck.cards[idx], grade)
  deck.cards[idx] = updated
  return updated
}
