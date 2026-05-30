'use client'
import { usePacking } from '../components/PackingProvider'
import type { Category, Item, Trip } from '../lib/types'

export function percentPacked(_items: Item[], _tripId: string): number {
  // TODO: rounded percent of the trip's items that are packed (0 when none)
  return 0
}

export type CategoryGroup = {
  category: Category
  items: Item[]
  packed: number
  total: number
}

export function groupByCategory(_items: Item[], _tripId: string): CategoryGroup[] {
  // TODO: build a group per non-empty category in CATEGORIES order
  return []
}

export function useTripList(tripId: string | null) {
  const { trips } = usePacking()
  const trip: Trip | null = tripId ? trips.find((t) => t.id === tripId) ?? null : null
  // TODO: compute groups + percent + tripItems
  return { trip, groups: [] as CategoryGroup[], percent: 0, tripItems: [] as Item[] }
}
