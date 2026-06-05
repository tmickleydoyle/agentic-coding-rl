'use client'
import { useShopping } from '../components/AppStateProvider'
import type { AisleGroup, Item } from '../lib/types'

export function groupByAisle(items: Item[]): AisleGroup[] {
  const map: Record<string, Item[]> = {}
  items.forEach((i) => {
    if (!map[i.aisle]) map[i.aisle] = []
    map[i.aisle].push(i)
  })
  return Object.keys(map)
    .sort()
    .map((aisle) => ({ aisle, items: map[aisle] }))
}

export function useShoppingViews() {
  const { items } = useShopping()
  const groups = groupByAisle(items)
  const boughtCount = items.filter((i) => i.bought).length
  const remaining = items.length - boughtCount
  return { groups, boughtCount, remaining }
}
