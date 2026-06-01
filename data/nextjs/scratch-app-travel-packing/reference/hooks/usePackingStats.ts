'use client'
import { usePacking } from '../components/PackingProvider'
import type { Category, Item } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export function percentPacked(items: Item[], tripId: string): number {
  const tripItems = items.filter((i) => i.tripId === tripId)
  if (tripItems.length === 0) return 0
  const packed = tripItems.filter((i) => i.packed).length
  return Math.round((packed / tripItems.length) * 100)
}

export type CategoryGroup = {
  category: Category
  items: Item[]
  packed: number
  total: number
}

export function groupByCategory(items: Item[], tripId: string): CategoryGroup[] {
  const tripItems = items.filter((i) => i.tripId === tripId)
  return CATEGORIES.map((category) => {
    const catItems = tripItems.filter((i) => i.category === category)
    return {
      category,
      items: catItems,
      packed: catItems.filter((i) => i.packed).length,
      total: catItems.length,
    }
  }).filter((g) => g.total > 0)
}

export function useTripList(tripId: string | null) {
  const { trips, items } = usePacking()
  const trip = tripId ? trips.find((t) => t.id === tripId) ?? null : null
  const groups = trip ? groupByCategory(items, trip.id) : []
  const percent = trip ? percentPacked(items, trip.id) : 0
  const tripItems = trip ? items.filter((i) => i.tripId === trip.id) : []
  return { trip, groups, percent, tripItems }
}
