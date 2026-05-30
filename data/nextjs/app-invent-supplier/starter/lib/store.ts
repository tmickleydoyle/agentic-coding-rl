import type { Product, Supplier } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level suppliers/products + id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSuppliers(_filter?: { category?: string | null }): Supplier[] {
  // TODO: return suppliers, applying optional category filter
  return []
}

export function findSupplier(_id: string): Supplier | undefined {
  // TODO: look up a supplier by id
  return undefined
}

export function productsForSupplier(_id: string): Product[] {
  // TODO: products whose supplierId === id
  return []
}

export function createSupplier(_input: {
  name: string
  category: string
  leadTimeDays: number
  rating?: number
}): Supplier {
  // TODO: append a new supplier with a fresh id and return it
  return { id: '', name: '', category: '', leadTimeDays: 0, rating: 0 }
}
