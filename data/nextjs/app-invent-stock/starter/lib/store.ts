import type { Product } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `products` and an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProducts(_filter?: { low?: string | null }): Product[] {
  // TODO: return products, applying an optional low filter
  return []
}

export function findProduct(_id: string): Product | undefined {
  // TODO: look up a product by id
  return undefined
}

export function createProduct(_input: {
  name: string
  qty: number
  reorderPoint: number
}): Product {
  // TODO: append a new product with a fresh id and return it
  return { id: '', name: '', qty: 0, reorderPoint: 0 }
}

export function adjustProduct(_id: string, _delta: number): Product | undefined {
  // TODO: adjust the product qty (clamped at 0) and return it, or undefined if absent
  return undefined
}
