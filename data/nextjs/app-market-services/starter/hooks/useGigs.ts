'use client'
import { useApp } from '../components/AppStateProvider'
import type { CategoryFilter, Gig } from '../lib/types'

export function filterGigs(_gigs: Gig[], _categoryFilter: CategoryFilter): Gig[] {
  // TODO: apply the category filter
  return []
}

export function averageRating(_gig: Gig): number {
  // TODO: mean of the gig's review ratings, or 0 when none
  return 0
}

export function useGigs() {
  const { gigs, categoryFilter } = useApp()
  const filtered = filterGigs(gigs, categoryFilter)
  return { filtered }
}
