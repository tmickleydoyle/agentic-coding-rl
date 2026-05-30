'use client'
import { useCards } from '../components/CardsProvider'
import type { Card, Charge } from '../lib/types'

export type CardTotals = {
  totalLimit: number
  totalSpent: number
  frozenCount: number
  cardCount: number
}

export function chargesFor(_charges: Charge[], _cardId: string): Charge[] {
  // TODO: return that card's charges in order
  return []
}

export function cardSpend(_charges: Charge[], _cardId: string): number {
  // TODO: sum that card's charge amounts
  return 0
}

export function cardRemaining(_card: Card, _charges: Charge[]): number {
  // TODO: card.limit - cardSpend(...)
  return 0
}

export function cardTotals(_cards: Card[], _charges: Charge[]): CardTotals {
  // TODO: total limit/spent, frozen count, card count
  return { totalLimit: 0, totalSpent: 0, frozenCount: 0, cardCount: 0 }
}

export function useCardsSummary() {
  const { cards, charges } = useCards()
  return { totals: cardTotals(cards, charges) }
}
