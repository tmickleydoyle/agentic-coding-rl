'use client'
import { useApp } from '../components/AppStateProvider'
import type { Card } from '../lib/types'

export function deckProgress(
  cards: Card[],
  deckId: string | null,
): { total: number; known: number; remaining: number } {
  const inDeck = cards.filter((c) => c.deckId === deckId)
  const known = inDeck.filter((c) => c.known).length
  return { total: inDeck.length, known, remaining: inDeck.length - known }
}

export function useDeck() {
  const { cards, selectedDeckId, studyIndex } = useApp()
  const deckCards = cards.filter((c) => c.deckId === selectedDeckId)
  const currentCard = deckCards[studyIndex] ?? null
  const progress = deckProgress(cards, selectedDeckId)
  return { deckCards, currentCard, progress }
}
