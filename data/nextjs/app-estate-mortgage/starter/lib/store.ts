import type { Property } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `properties` + id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listProperties(): Property[] {
  // TODO: return all properties
  return []
}

export function findProperty(_id: string): Property | undefined {
  // TODO: look up a property by id
  return undefined
}

export function createProperty(_input: { address: string; price?: number }): Property {
  // TODO: append a new property with a fresh id and return it
  return { id: '', address: '', price: 0 }
}

export function deleteProperty(_id: string): boolean {
  // TODO: remove the property; return whether it existed
  return false
}
