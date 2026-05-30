import type { Property } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `properties` + id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProperties(_filter?: {
  type?: string | null
  minBeds?: string | null
  maxPrice?: string | null
}): Property[] {
  // TODO: return properties, applying optional type/minBeds/maxPrice filters
  return []
}

export function findProperty(_id: string): Property | undefined {
  // TODO: look up a property by id
  return undefined
}

export function createProperty(_input: {
  address: string
  type?: string
  price?: number
  beds?: number
  baths?: number
}): Property {
  // TODO: append a new property with a fresh id and return it
  return { id: '', address: '', type: 'house', price: 0, beds: 0, baths: 0 }
}

export function deleteProperty(_id: string): boolean {
  // TODO: remove the property; return whether it existed
  return false
}
