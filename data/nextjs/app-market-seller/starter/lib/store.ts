import type { Order, Product } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `products`, `orders`, id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProducts(_filter?: { inStock?: string | null }): Product[] {
  // TODO: return products, applying optional ?inStock filter
  return []
}

export function createProduct(_input: { name: string; price?: number; stock?: number }): Product {
  // TODO: append a new product with a fresh id and return it
  return { id: '', name: '', price: 0, stock: 0 }
}

export function listOrders(_filter?: { fulfilled?: string | null }): Order[] {
  // TODO: return orders, applying optional ?fulfilled filter
  return []
}

export function fulfillOrder(_id: string): Order | undefined {
  // TODO: mark the order fulfilled and return it, or undefined if absent
  return undefined
}
