'use client'
import { useApp } from '../components/AppStateProvider'
import type { Card, Deck, Grade } from '../lib/types'
import { TODAY } from '../lib/types'

export function dueCards(deck: Deck): Card[] {
  return deck.cards.filter((c) => c.dueDay <= TODAY)
}

export function reschedule(card: Card, grade: Grade): Card {
  if (grade === 'hard') {
    return { ...card, interval: 1, dueDay: TODAY + 1 }
  }
  const interval = Math.max(1, card.interval) * 2
  return { ...card, interval, dueDay: TODAY + interval }
}

export function findDeck(decks: Deck[], id: string | null): Deck | undefined {
  if (!id) return undefined
  return decks.find((d) => d.id === id)
}

export function useActiveDeck(): { deck: Deck | undefined; due: Card[] } {
  const { decks, activeDeckId } = useApp()
  const deck = findDeck(decks, activeDeckId)
  const due = deck ? dueCards(deck) : []
  return { deck, due }
}
