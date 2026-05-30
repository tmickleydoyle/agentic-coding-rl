'use client'
import { useShopping } from '../components/AppStateProvider'
import type { AisleGroup, Item } from '../lib/types'

export function groupByAisle(_items: Item[]): AisleGroup[] {
  // TODO: group items by aisle, aisles sorted alphabetically
  return []
}

export function useShoppingViews() {
  useShopping()
  // TODO: derive groups, boughtCount, remaining from the active list
  return { groups: [] as AisleGroup[], boughtCount: 0, remaining: 0 }
}
