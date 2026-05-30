import type { Order, Region } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `orders` + an id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isRegion(_v: unknown): _v is Region {
  // TODO: narrow to 'NA' | 'EU' | 'APAC'
  return false
}

export function listOrders(_filter?: { region?: string | null; product?: string | null }): Order[] {
  // TODO: return orders, applying optional region + product filters
  return []
}

export function summarizeByRegion(_input: Order[]): { region: Region; revenue: number; units: number }[] {
  // TODO: sum revenue + units per region in ['NA','EU','APAC'] order (include zeros)
  return []
}

export function summarizeByProduct(_input: Order[]): { product: string; revenue: number; units: number }[] {
  // TODO: sum revenue + units per product, sorted by revenue descending
  return []
}

export function createOrder(_input: {
  product: string
  region: Region
  revenue?: number
  units?: number
  month?: string
}): Order {
  // TODO: append a new order with a fresh id and defaults
  return { id: '', product: '', region: 'NA', revenue: 0, units: 0, month: 'Jan' }
}

export function deleteOrder(_id: string): boolean {
  // TODO: remove the order; return whether it existed
  return false
}
