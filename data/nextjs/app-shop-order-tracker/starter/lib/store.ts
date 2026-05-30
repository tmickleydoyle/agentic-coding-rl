import type { Order, OrderStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `orders` and an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isStatus(value: unknown): value is OrderStatus {
  return value === 'placed' || value === 'shipped' || value === 'delivered'
}

export function listOrders(_filter?: { status?: string | null }): Order[] {
  // TODO: return orders, applying an optional status filter
  return []
}

export function createOrder(_input: { item: string; total: number }): Order {
  // TODO: append a new placed order with a fresh id and return it
  return { id: '', item: '', total: 0, status: 'placed' }
}

export function findOrder(_id: string): Order | undefined {
  // TODO: look up an order by id
  return undefined
}

export function setStatus(_id: string, _status: OrderStatus): Order | undefined {
  // TODO: set the order's status and return it, or undefined if absent
  return undefined
}
