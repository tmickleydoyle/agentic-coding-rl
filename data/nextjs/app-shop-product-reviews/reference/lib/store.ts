import type { Product, Review } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let products: Product[] = []
let reviews: Review[] = []
let nextReviewId = 1
let nextCreatedAt = 1

function seed(): void {
  products = [
    { id: 'p1', name: 'Wireless Mouse', category: 'accessories' },
    { id: 'p2', name: 'Mechanical Keyboard', category: 'accessories' },
    { id: 'p3', name: 'Standing Desk', category: 'furniture' },
  ]
  reviews = [
    { id: 'r1', productId: 'p1', rating: 5, text: 'Great mouse', createdAt: 1 },
    { id: 'r2', productId: 'p1', rating: 3, text: 'A bit small', createdAt: 2 },
    { id: 'r3', productId: 'p2', rating: 4, text: 'Clicky and nice', createdAt: 3 },
  ]
  nextReviewId = 4
  nextCreatedAt = 4
}

seed()

export function __reset(): void {
  seed()
}

function sortReviewList(list: Review[], sort?: string | null): Review[] {
  const out = list.slice()
  if (sort === 'rating') out.sort((a, b) => b.rating - a.rating)
  else if (sort === 'date') out.sort((a, b) => b.createdAt - a.createdAt)
  return out
}

export function listReviews(filter?: { productId?: string | null; sort?: string | null }): Review[] {
  let out = reviews.slice()
  const productId = filter?.productId
  if (productId) out = out.filter((r) => r.productId === productId)
  return sortReviewList(out, filter?.sort)
}

export function createReview(input: { productId: string; rating: number; text: string }): Review {
  const review: Review = {
    id: `r${nextReviewId++}`,
    productId: input.productId,
    rating: input.rating,
    text: input.text,
    createdAt: nextCreatedAt++,
  }
  reviews.push(review)
  return review
}

export function deleteReview(id: string): boolean {
  const idx = reviews.findIndex((r) => r.id === id)
  if (idx === -1) return false
  reviews.splice(idx, 1)
  return true
}

export function averageFor(productId: string): number {
  const rs = reviews.filter((r) => r.productId === productId)
  if (rs.length === 0) return 0
  return rs.reduce((sum, r) => sum + r.rating, 0) / rs.length
}

export function countFor(productId: string): number {
  return reviews.filter((r) => r.productId === productId).length
}

export function listProducts(): (Product & { average: number; count: number })[] {
  return products.map((p) => ({ ...p, average: averageFor(p.id), count: countFor(p.id) }))
}
