'use client'
import { useApp } from '../components/AppStateProvider'
import type { CategoryFilter, Listing } from '../lib/types'

export type ListingCounts = {
  total: number
  favorites: number
  byCategory: Record<string, number>
}

export function countListings(listings: Listing[], favorites: string[]): ListingCounts {
  const byCategory: Record<string, number> = {}
  listings.forEach((l) => {
    byCategory[l.category] = (byCategory[l.category] ?? 0) + 1
  })
  return {
    total: listings.length,
    favorites: favorites.length,
    byCategory,
  }
}

export function filterListings(listings: Listing[], categoryFilter: CategoryFilter): Listing[] {
  return listings.filter((l) => categoryFilter === 'all' || l.category === categoryFilter)
}

export function useListings() {
  const { listings, favorites, categoryFilter } = useApp()
  const counts = countListings(listings, favorites)
  const filtered = filterListings(listings, categoryFilter)
  return { counts, filtered }
}
