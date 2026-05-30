import type { Category, Listing } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `listings` + id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listListings(_filter?: { category?: string | null; maxPrice?: string | null }): Listing[] {
  // TODO: return listings, applying optional category + maxPrice filters
  return []
}

export function createListing(_input: {
  title: string
  category?: Category
  price?: number
  seller?: string
  description?: string
}): Listing {
  // TODO: append a new listing with a fresh id and return it
  return { id: '', title: '', category: 'misc', price: 0, seller: '', description: '' }
}

export function deleteListing(_id: string): boolean {
  // TODO: remove the listing; return whether it existed
  return false
}
