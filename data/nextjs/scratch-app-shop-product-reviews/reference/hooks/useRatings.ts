'use client'
import { useReviews } from '../components/AppStateProvider'
import type { Product, Review, SortBy } from '../lib/types'

export function reviewsFor(reviews: Review[], productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId)
}

export function averageRating(reviews: Review[], productId: string): number {
  const rs = reviewsFor(reviews, productId)
  if (rs.length === 0) return 0
  return rs.reduce((sum, r) => sum + r.rating, 0) / rs.length
}

export function sortReviews(reviews: Review[], sortBy: SortBy): Review[] {
  const out = reviews.slice()
  if (sortBy === 'rating') out.sort((a, b) => b.rating - a.rating)
  else out.sort((a, b) => b.createdAt - a.createdAt)
  return out
}

export function topRated(products: Product[], reviews: Review[]): Product[] {
  return products
    .map((p, idx) => ({ p, avg: averageRating(reviews, p.id), idx }))
    .sort((a, b) => b.avg - a.avg || a.idx - b.idx)
    .map((x) => x.p)
}

export function useRatings() {
  const { products, reviews, selectedId, sortBy } = useReviews()
  const productReviews = selectedId ? reviewsFor(reviews, selectedId) : []
  const sorted = sortReviews(productReviews, sortBy)
  const average = selectedId ? averageRating(reviews, selectedId) : 0
  const ranked = topRated(products, reviews)
  return { average, sorted, ranked }
}
