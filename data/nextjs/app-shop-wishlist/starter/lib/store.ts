import type { Product } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `products` and an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProducts(_filter?: { category?: string | null; maxPrice?: string | null }): Product[] {
  // TODO: return products, applying optional category + maxPrice filters
  return []
}

export function createProduct(_input: { name: string; category?: string; price: number }): Product {
  // TODO: append a new product with a fresh id and return it
  return { id: '', name: '', category: '', price: 0 }
}

export function deleteProduct(_id: string): boolean {
  // TODO: remove the product; return whether it existed
  return false
}
