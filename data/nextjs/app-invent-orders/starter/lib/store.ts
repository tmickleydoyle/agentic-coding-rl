import type { PurchaseOrder } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `orders` and an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listOrders(_filter?: { supplier?: string | null }): PurchaseOrder[] {
  // TODO: return orders, applying an optional supplier filter
  return []
}

export function findOrder(_id: string): PurchaseOrder | undefined {
  // TODO: look up an order by id
  return undefined
}

export function createOrder(_input: {
  supplier: string
  item: string
  ordered: number
}): PurchaseOrder {
  // TODO: append a new order with a fresh id and return it
  return { id: '', supplier: '', item: '', ordered: 0, received: 0, cancelled: false }
}

export function receiveOrder(_id: string, _qty: number): PurchaseOrder | undefined {
  // TODO: add qty to received (clamped to ordered, ignore cancelled) and return it
  return undefined
}

export function cancelOrder(_id: string): PurchaseOrder | undefined {
  // TODO: mark the order cancelled and return it, or undefined if absent
  return undefined
}
