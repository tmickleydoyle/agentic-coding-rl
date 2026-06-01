'use client'
import { useWarehouse } from '../components/AppStateProvider'
import type { Bin } from '../lib/types'
import { used } from '../lib/types'

export type WarehouseStats = {
  bins: number
  capacity: number
  used: number
}

export function computeStats(bins: Bin[]): WarehouseStats {
  const stats: WarehouseStats = { bins: bins.length, capacity: 0, used: 0 }
  bins.forEach((b) => {
    stats.capacity += b.capacity
    stats.used += used(b)
  })
  return stats
}

export function useBins() {
  const { bins, selectedId } = useWarehouse()
  const stats = computeStats(bins)
  const selected = bins.find((b) => b.id === selectedId) ?? null
  return { bins, stats, selected }
}
