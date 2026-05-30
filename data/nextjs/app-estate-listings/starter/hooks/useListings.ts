'use client'
import { useEstate } from '../components/AppStateProvider'
import type { BedsFilter, Property, TypeFilter } from '../lib/types'

export function filterProperties(
  _properties: Property[],
  _typeFilter: TypeFilter,
  _bedsFilter: BedsFilter,
  _maxPrice: number | null,
): Property[] {
  // TODO: apply type/beds/maxPrice filters
  return []
}

export type ListingStats = {
  total: number
  favoriteCount: number
  averagePrice: number
}

export function computeStats(_properties: Property[], _favorites: string[]): ListingStats {
  // TODO: compute total, favoriteCount, and rounded averagePrice
  return { total: 0, favoriteCount: 0, averagePrice: 0 }
}

export function useListings() {
  const { properties, favorites, typeFilter, bedsFilter, maxPrice } = useEstate()
  const filtered = filterProperties(properties, typeFilter, bedsFilter, maxPrice)
  const stats = computeStats(properties, favorites)
  return { filtered, stats }
}
