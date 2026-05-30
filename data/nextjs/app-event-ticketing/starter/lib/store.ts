import type { EventItem, Order } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `events`, `orders`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEvents(_id?: string | null): EventItem[] {
  // TODO: return all events, or just the one matching ?id=
  return []
}

export function findEvent(_id: string): EventItem | undefined {
  // TODO: look up an event by id
  return undefined
}

export function findTier(_eventId: string, _tierId: string) {
  // TODO: look up a tier within an event
  return undefined as EventItem['tiers'][number] | undefined
}

export function listOrders(_eventId?: string | null): Order[] {
  // TODO: return orders, applying an optional eventId filter
  return []
}

export function createOrder(_input: {
  eventId: string
  tierId: string
  qty: number
  buyer: string
}): Order {
  // TODO: append a new order with a fresh id, increment the tier sold, compute total
  return { id: '', eventId: '', tierId: '', qty: 0, buyer: '', total: 0 }
}

export function deleteOrder(_id: string): boolean {
  // TODO: remove the order, restore the tier sold; return whether it existed
  return false
}
