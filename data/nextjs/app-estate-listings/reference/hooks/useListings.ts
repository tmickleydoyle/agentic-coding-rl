'use client'
import { useEstate } from '../components/AppStateProvider'
import type { BedsFilter, Property, TypeFilter } from '../lib/types'

export function filterProperties(
  properties: Property[],
  typeFilter: TypeFilter,
  bedsFilter: BedsFilter,
  maxPrice: number | null,
): Property[] {
  return properties.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    if (bedsFilter !== 'all' && p.beds < bedsFilter) return false
    if (maxPrice != null && p.price > maxPrice) return false
    return true
  })
}

export type ListingStats = {
  total: number
  favoriteCount: number
  averagePrice: number
}

export function computeStats(properties: Property[], favorites: string[]): ListingStats {
  const total = properties.length
  const sum = properties.reduce((acc, p) => acc + p.price, 0)
  return {
    total,
    favoriteCount: favorites.length,
    averagePrice: total === 0 ? 0 : Math.round(sum / total),
  }
}

export function useListings() {
  const { properties, favorites, typeFilter, bedsFilter, maxPrice } = useEstate()
  const filtered = filterProperties(properties, typeFilter, bedsFilter, maxPrice)
  const stats = computeStats(properties, favorites)
  return { filtered, stats }
}
