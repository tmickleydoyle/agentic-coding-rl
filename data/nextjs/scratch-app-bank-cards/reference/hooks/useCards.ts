'use client'
import { useCards } from '../components/CardsProvider'
import type { Card, Charge } from '../lib/types'

export type CardTotals = {
  totalLimit: number
  totalSpent: number
  frozenCount: number
  cardCount: number
}

export function spendByCard(charges: Charge[]): Record<string, number> {
  const out: Record<string, number> = {}
  charges.forEach((c) => {
    out[c.cardId] = (out[c.cardId] ?? 0) + c.amount
  })
  return out
}

export function chargesFor(charges: Charge[], cardId: string): Charge[] {
  return charges.filter((c) => c.cardId === cardId)
}

export function cardSpend(charges: Charge[], cardId: string): number {
  let total = 0
  charges.forEach((c) => {
    if (c.cardId === cardId) total += c.amount
  })
  return total
}

export function cardRemaining(card: Card, charges: Charge[]): number {
  return card.limit - cardSpend(charges, card.id)
}

export function cardTotals(cards: Card[], charges: Charge[]): CardTotals {
  let totalLimit = 0
  let frozenCount = 0
  cards.forEach((c) => {
    totalLimit += c.limit
    if (c.frozen) frozenCount += 1
  })
  let totalSpent = 0
  charges.forEach((c) => {
    totalSpent += c.amount
  })
  return { totalLimit, totalSpent, frozenCount, cardCount: cards.length }
}

export function useCardsSummary() {
  const { cards, charges } = useCards()
  return { totals: cardTotals(cards, charges) }
}
