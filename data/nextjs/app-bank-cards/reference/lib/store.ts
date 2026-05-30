import type { Card, Charge } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// CardsProvider state. Tests call __reset() in beforeEach for isolation.

let cards: Card[] = []
let charges: Charge[] = []
let nextCardId = 1
let nextChargeId = 1

function seed(): void {
  cards = [
    { id: 'k1', label: 'Personal Visa', last4: '4242', frozen: false, limit: 1000 },
    { id: 'k2', label: 'Travel Mastercard', last4: '1881', frozen: false, limit: 2000 },
    { id: 'k3', label: 'Backup Card', last4: '0007', frozen: true, limit: 500 },
  ]
  charges = [
    { id: 'h1', cardId: 'k1', merchant: 'Coffee Co', amount: 6 },
    { id: 'h2', cardId: 'k1', merchant: 'Bookshop', amount: 54 },
    { id: 'h3', cardId: 'k2', merchant: 'Grand Inn', amount: 320 },
    { id: 'h4', cardId: 'k2', merchant: 'SkyAir', amount: 480 },
    { id: 'h5', cardId: 'k1', merchant: 'Bistro', amount: 40 },
  ]
  nextCardId = 4
  nextChargeId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listCards(): Card[] {
  return cards.slice()
}

export function findCard(id: string): Card | undefined {
  return cards.find((c) => c.id === id)
}

const LAST4 = /^\d{4}$/

export function isValidLast4(value: unknown): value is string {
  return typeof value === 'string' && LAST4.test(value)
}

export function createCard(input: {
  label: string
  last4: string
  limit?: number
}): Card {
  const card: Card = {
    id: `k${nextCardId++}`,
    label: input.label,
    last4: input.last4,
    frozen: false,
    limit: input.limit ?? 0,
  }
  cards.push(card)
  return card
}

export function updateCard(
  id: string,
  patch: { frozen?: boolean; limit?: number },
): Card | undefined {
  const card = findCard(id)
  if (!card) return undefined
  if (typeof patch.frozen === 'boolean') card.frozen = patch.frozen
  if (typeof patch.limit === 'number' && patch.limit >= 0) card.limit = patch.limit
  return card
}

export function listCharges(filter?: { cardId?: string | null }): Charge[] {
  let out = charges.slice()
  const cardId = filter?.cardId
  if (cardId) out = out.filter((c) => c.cardId === cardId)
  return out
}

export function createCharge(input: {
  cardId: string
  merchant?: string
  amount: number
}): Charge {
  const charge: Charge = {
    id: `h${nextChargeId++}`,
    cardId: input.cardId,
    merchant: input.merchant ?? '',
    amount: input.amount,
  }
  charges.push(charge)
  return charge
}
