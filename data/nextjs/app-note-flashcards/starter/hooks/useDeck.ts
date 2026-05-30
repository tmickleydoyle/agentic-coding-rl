'use client'
import { useApp } from '../components/AppStateProvider'
import type { Card } from '../lib/types'

export function deckProgress(
  _cards: Card[],
  _deckId: string | null,
): { total: number; known: number; remaining: number } {
  // TODO: count total/known/remaining cards in the deck
  return { total: 0, known: 0, remaining: 0 }
}

export function useDeck() {
  const { cards } = useApp()
  void cards
  // TODO: return deckCards, currentCard, and progress for the selected deck.
  return {
    deckCards: [] as Card[],
    currentCard: null as Card | null,
    progress: { total: 0, known: 0, remaining: 0 },
  }
}
