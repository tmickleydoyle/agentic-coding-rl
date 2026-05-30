import type { Card, Charge } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `cards`, `charges`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

const LAST4 = /^\d{4}$/

export function isValidLast4(value: unknown): value is string {
  return typeof value === 'string' && LAST4.test(value)
}

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCards(): Card[] {
  // TODO: return all cards
  return []
}

export function findCard(_id: string): Card | undefined {
  // TODO: look up a card by id
  return undefined
}

export function createCard(_input: {
  label: string
  last4: string
  limit?: number
}): Card {
  // TODO: append a new unfrozen card with a fresh id and return it
  return { id: '', label: '', last4: '', frozen: false, limit: 0 }
}

export function updateCard(
  _id: string,
  _patch: { frozen?: boolean; limit?: number },
): Card | undefined {
  // TODO: apply the patch to the card and return it, or undefined if missing
  return undefined
}

export function listCharges(_filter?: { cardId?: string | null }): Charge[] {
  // TODO: return charges, applying optional cardId filter
  return []
}

export function createCharge(_input: {
  cardId: string
  merchant?: string
  amount: number
}): Charge {
  // TODO: append a new charge with a fresh id and return it
  return { id: '', cardId: '', merchant: '', amount: 0 }
}
