'use client'
import { useReviews } from '../components/AppStateProvider'
import type { Product, Review, SortBy } from '../lib/types'

export function reviewsFor(_reviews: Review[], _productId: string): Review[] {
  // TODO: return reviews for a product
  return []
}

export function averageRating(_reviews: Review[], _productId: string): number {
  // TODO: mean rating for a product (0 if none)
  return 0
}

export function sortReviews(_reviews: Review[], _sortBy: SortBy): Review[] {
  // TODO: sort by rating desc or date desc
  return []
}

export function topRated(_products: Product[], _reviews: Review[]): Product[] {
  // TODO: rank products by average rating descending
  return []
}

export function useRatings() {
  const { products, reviews, selectedId, sortBy } = useReviews()
  const productReviews = selectedId ? reviewsFor(reviews, selectedId) : []
  const sorted = sortReviews(productReviews, sortBy)
  const average = selectedId ? averageRating(reviews, selectedId) : 0
  const ranked = topRated(products, reviews)
  return { average, sorted, ranked }
}
