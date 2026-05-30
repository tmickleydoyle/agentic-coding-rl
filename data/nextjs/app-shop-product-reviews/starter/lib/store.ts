import type { Product, Review } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `products`, `reviews`, id + createdAt counters; seed them;
// provide __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listReviews(_filter?: { productId?: string | null; sort?: string | null }): Review[] {
  // TODO: return reviews, applying optional productId filter and sort
  return []
}

export function createReview(_input: { productId: string; rating: number; text: string }): Review {
  // TODO: append a new review with a fresh id + createdAt and return it
  return { id: '', productId: '', rating: 0, text: '', createdAt: 0 }
}

export function deleteReview(_id: string): boolean {
  // TODO: remove the review; return whether it existed
  return false
}

export function averageFor(_productId: string): number {
  // TODO: mean rating for a product
  return 0
}

export function countFor(_productId: string): number {
  // TODO: number of reviews for a product
  return 0
}

export function listProducts(): (Product & { average: number; count: number })[] {
  // TODO: return products each with computed average + count
  return []
}
