import type { Category, Gig } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `gigs`, gig + review id counters; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listGigs(_filter?: { category?: string | null }): Gig[] {
  // TODO: return gigs, applying optional category filter
  return []
}

export function findGig(_id: string): Gig | undefined {
  // TODO: look up a gig by id
  return undefined
}

export function createGig(_input: { title: string; category?: Category; price?: number }): Gig {
  // TODO: append a new gig (reviews: []) with a fresh id and return it
  return { id: '', title: '', category: 'dev', price: 0, reviews: [] }
}

export function addReview(
  _gigId: string,
  _input: { author: string; rating: number; text?: string },
): Gig | undefined {
  // TODO: append a review with a fresh id; return the gig, or undefined if absent
  return undefined
}
