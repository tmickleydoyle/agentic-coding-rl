'use client'
import { useApp } from '../components/AppStateProvider'
import type { CategoryFilter, Gig } from '../lib/types'

export function filterGigs(gigs: Gig[], categoryFilter: CategoryFilter): Gig[] {
  return gigs.filter((g) => categoryFilter === 'all' || g.category === categoryFilter)
}

export function averageRating(gig: Gig): number {
  if (gig.reviews.length === 0) return 0
  let sum = 0
  gig.reviews.forEach((r) => {
    sum += r.rating
  })
  return sum / gig.reviews.length
}

export function useGigs() {
  const { gigs, categoryFilter } = useApp()
  const filtered = filterGigs(gigs, categoryFilter)
  return { filtered }
}
