'use client'
import { useApp } from '../components/AppStateProvider'
import type { CategoryFilter, Listing } from '../lib/types'

export type ListingCounts = {
  total: number
  favorites: number
  byCategory: Record<string, number>
}

export function countListings(_listings: Listing[], _favorites: string[]): ListingCounts {
  // TODO: compute total/favorites and per-category counts
  return { total: 0, favorites: 0, byCategory: {} }
}

export function filterListings(_listings: Listing[], _categoryFilter: CategoryFilter): Listing[] {
  // TODO: apply the category filter
  return []
}

export function useListings() {
  const { listings, favorites, categoryFilter } = useApp()
  const counts = countListings(listings, favorites)
  const filtered = filterListings(listings, categoryFilter)
  return { counts, filtered }
}
